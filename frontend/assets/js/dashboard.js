// Load or Initialize State
let state = loadState();
let currentModalContext = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...structuredClone(DEFAULT_STATE), ...parsed };
    }
  } catch (e) {
    console.warn('State fallback:', e);
  }
  return structuredClone(DEFAULT_STATE);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Unable to save to localStorage:', e);
  }
}

function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(DEFAULT_STATE);
  saveState();
  renderApp();
  showToast('Demo data restored to initial baseline', 'indigo');
}

// =========================================================================
// 2. DYNAMIC METRIC COMPUTATION ENGINE (Syncs KPIs, Pipeline & Badges)
// =========================================================================
function getFilteredData() {
  const prop = state.propertyFilter;
  const q = state.searchQuery.trim().toLowerCase();

  const matchProp = (itemProp) => prop === 'ALL' || itemProp === prop;
  const matchQuery = (fields) => !q || fields.some(f => String(f || '').toLowerCase().includes(q));

  const leads = state.leads.filter(l => matchProp(l.property) && matchQuery([l.name, l.property, l.unit, l.stage, l.source]));
  const tours = state.tours.filter(t => matchProp(t.property) && matchQuery([t.prospect, t.property, t.unit, t.type, t.status]));
  const conversations = state.aiConversations.filter(c => matchProp(c.property) && matchQuery([c.name, c.property, c.snippet, c.tag]));
  const applications = state.applications.filter(a => matchProp(a.property) && matchQuery([a.applicant, a.property, a.unit, a.missingDoc, a.status]));
  const renewals = state.renewals.filter(r => matchProp(r.property) && matchQuery([r.resident, r.property, r.unit]));
  const tasks = state.tasks.filter(tk => matchProp(tk.property) && matchQuery([tk.resident, tk.task, tk.property]));

  return { leads, tours, conversations, applications, renewals, tasks };
}

function computeMetrics() {
  // Combine the sample portfolio totals with changes to editable demo records.
  const isFiltered = state.propertyFilter !== 'ALL' || state.searchQuery.trim() !== '';
  const filtered = getFilteredData();

  const leadDelta = state.leads.length - DEFAULT_STATE.leads.length;
  const tourDelta = state.tours.length - DEFAULT_STATE.tours.length;
  const appDelta = state.applications.length - DEFAULT_STATE.applications.length;
  const renewalDelta = state.renewals.length - DEFAULT_STATE.renewals.length;
  const waitingAi = state.aiConversations.filter(c => !c.resolved).length;

  const scaleFactor = isFiltered ? Math.max(0.25, filtered.leads.length / Math.max(1, state.leads.length)) : 1;
  const rangeMultiplier = state.pipelineRange === '30 days' ? 1 : state.pipelineRange === 'Quarter' ? 2.8 : 9.4;

  const newLeadsCount = Math.max(1, Math.round((38 + leadDelta) * scaleFactor * rangeMultiplier));
  const activeConvCount = Math.max(1, Math.round((11 + (waitingAi - 3)) * scaleFactor * (state.pipelineRange === '30 days' ? 1 : 2.1)));
  const toursCount = Math.max(1, Math.round((4 + tourDelta) * scaleFactor * (state.pipelineRange === '30 days' ? 1 : 2.6)));
  const appsCount = Math.max(1, Math.round((7 + appDelta) * scaleFactor * rangeMultiplier));
  const pendingAppsCount = Math.max(0, Math.round((2 + filtered.applications.filter(a => a.status === 'Pending').length - 3) * scaleFactor));
  const renewalsCount = Math.max(1, Math.round((5 + renewalDelta) * scaleFactor));

  const leasedCount = Math.max(1, Math.round((3 + state.leads.filter(l => l.stage === 'Leased').length - 1) * scaleFactor * rangeMultiplier));
  const conversionRate = ((leasedCount / Math.max(1, newLeadsCount)) * 100).toFixed(1);

  // 6-stage Pipeline breakdown
  const pNew = newLeadsCount;
  const pQual = Math.max(1, Math.round(pNew * 0.617));
  const pTour = Math.max(1, Math.round(pQual * 0.582));
  const pApp = Math.max(1, Math.round(pTour * 0.522));
  const pAppr = Math.max(1, Math.round(pApp * 0.625));
  const pLeased = leasedCount;

  return {
    newLeadsCount,
    activeConvCount,
    toursCount,
    appsCount,
    pendingAppsCount,
    renewalsCount,
    conversionRate,
    waitingAi,
    openTasks: state.tasks.filter(t => !t.done).length,
    pipeline: [
      { key: 'New Lead', count: pNew, unit: 'prospects', badge: '62% >', widthPct: 100, style: 'pill-citron' },
      { key: 'Qualified', count: pQual, unit: 'prospects', badge: '58% >', widthPct: 74, style: 'dot' },
      { key: 'Tour', count: pTour, unit: 'prospects', badge: '52% >', widthPct: 55, style: 'dot' },
      { key: 'Applied', count: pApp, unit: 'prospects', badge: '63% >', widthPct: 38, style: 'dot' },
      { key: 'Approved', count: pAppr, unit: 'prospects', badge: '73% >', widthPct: 24, style: 'dot' },
      { key: 'Leased', count: pLeased, unit: 'leases', badge: `${conversionRate}% of leads`, widthPct: 48, style: 'pill-dark' }
    ]
  };
}

// =========================================================================
// 7. CRUD CONFIGURATION & MODAL HANDLERS
// =========================================================================
function getEntityConfig(entity) {
  const configs = {
    leads: {
      title: 'Leasing Pipeline Leads',
      singular: 'Lead',
      subtitle: 'Manage incoming prospects from initial inquiry to signed lease.',
      statuses: ['New Lead', 'Qualified', 'Tour', 'Applied', 'Approved', 'Leased'],
      columns: [
        { key: 'name', label: 'Prospect', type: 'person' },
        { key: 'property', label: 'Property' },
        { key: 'unit', label: 'Unit' },
        { key: 'stage', label: 'Pipeline Stage', type: 'badge' },
        { key: 'source', label: 'Source' },
        { key: 'intent', label: 'AI Intent', type: 'badge' }
      ],
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Clara Oswald' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'clara@domain.com' },
        { name: 'property', label: 'Property', type: 'select', options: ['The Alder', 'Marlowe Court', 'Juniper Flats', 'Beacon Yard', 'Finch & Ninth', 'Oakline Lofts'] },
        { name: 'unit', label: 'Unit Number', type: 'text', required: true, placeholder: 'e.g. 412' },
        { name: 'stage', label: 'Stage', type: 'select', options: ['New Lead', 'Qualified', 'Tour', 'Applied', 'Approved', 'Leased'] },
        { name: 'source', label: 'Lead Source', type: 'select', options: ['Website', 'Zillow', 'Apartments.com', 'Referral', 'Direct Chat', 'Walk-in'] },
        { name: 'intent', label: 'Intent Score', type: 'select', options: ['High intent', 'Medium intent'] },
        { name: 'avatar', label: 'Avatar Photo URL (optional)', type: 'url', placeholder: 'https://images.unsplash.com/...' }
      ]
    },
    tours: {
      title: 'Scheduled Property Tours',
      singular: 'Tour',
      subtitle: 'Coordinate agent-led, self-guided, and virtual unit walkthroughs.',
      statuses: ['Confirmed', 'Scheduled', 'Rescheduled'],
      columns: [
        { key: 'prospect', label: 'Prospect' },
        { key: 'time', label: 'Time' },
        { key: 'meridiem', label: 'AM/PM' },
        { key: 'property', label: 'Property' },
        { key: 'unit', label: 'Unit' },
        { key: 'type', label: 'Tour Format' },
        { key: 'status', label: 'Status', type: 'badge' }
      ],
      fields: [
        { name: 'prospect', label: 'Prospect Name', type: 'text', required: true, placeholder: 'e.g. Jordan Vance' },
        { name: 'time', label: 'Time (e.g. 1:00)', type: 'text', required: true, placeholder: '1:00' },
        { name: 'meridiem', label: 'AM / PM', type: 'select', options: ['AM', 'PM'] },
        { name: 'property', label: 'Property', type: 'select', options: ['The Alder', 'Marlowe Court', 'Juniper Flats', 'Beacon Yard', 'Finch & Ninth'] },
        { name: 'unit', label: 'Unit', type: 'text', required: true, placeholder: '308' },
        { name: 'type', label: 'Tour Format', type: 'select', options: ['Agent-led', 'Self-guided', 'Virtual'] },
        { name: 'status', label: 'Status', type: 'select', options: ['Confirmed', 'Scheduled', 'Rescheduled'] }
      ]
    },
    applications: {
      title: 'Rental Applications',
      singular: 'Application',
      subtitle: 'Track screening documents, credit checks, and approval decisions.',
      statuses: ['Pending', 'Approved'],
      columns: [
        { key: 'applicant', label: 'Applicant' },
        { key: 'property', label: 'Property' },
        { key: 'unit', label: 'Unit' },
        { key: 'missingDoc', label: 'Missing Document' },
        { key: 'score', label: 'Credit Score' },
        { key: 'status', label: 'Status', type: 'badge' }
      ],
      fields: [
        { name: 'applicant', label: 'Applicant Name', type: 'text', required: true },
        { name: 'property', label: 'Property', type: 'select', options: ['The Alder', 'Marlowe Court', 'Juniper Flats', 'Beacon Yard', 'Finch & Ninth'] },
        { name: 'unit', label: 'Unit', type: 'text', required: true },
        { name: 'missingDoc', label: 'Missing Item', type: 'select', options: ['Proof of income', 'Photo ID', 'Landlord ref', 'Complete'] },
        { name: 'score', label: 'Credit Score', type: 'number', required: true, placeholder: '735' },
        { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved'] }
      ]
    },
    renewals: {
      title: 'Lease Renewals',
      singular: 'Renewal',
      subtitle: 'Upcoming 90-day lease expirations and retention offers.',
      statuses: ['Sent', 'Pending', 'Accepted'],
      columns: [
        { key: 'resident', label: 'Resident' },
        { key: 'property', label: 'Property' },
        { key: 'unit', label: 'Unit' },
        { key: 'daysLeft', label: 'Days Left' },
        { key: 'currentRent', label: 'Monthly Rent' },
        { key: 'offerStatus', label: 'Offer Status', type: 'badge' }
      ],
      fields: [
        { name: 'resident', label: 'Resident Name', type: 'text', required: true },
        { name: 'property', label: 'Property', type: 'select', options: ['Finch & Ninth', 'Oakline Lofts', 'The Alder', 'Marlowe Court', 'Beacon Yard'] },
        { name: 'unit', label: 'Unit', type: 'text', required: true },
        { name: 'daysLeft', label: 'Days Remaining', type: 'number', required: true, placeholder: '30' },
        { name: 'currentRent', label: 'Current Rent', type: 'text', required: true, placeholder: '$2,450' },
        { name: 'offerStatus', label: 'Offer Status', type: 'select', options: ['Sent', 'Pending', 'Accepted'] }
      ]
    },
    tasks: {
      title: 'Follow-ups & Tasks',
      singular: 'Task',
      subtitle: 'Daily leasing follow-ups and resident verification items.',
      statuses: ['High', 'Medium'],
      columns: [
        { key: 'resident', label: 'Contact' },
        { key: 'task', label: 'Action Item' },
        { key: 'property', label: 'Property' },
        { key: 'due', label: 'Due' },
        { key: 'priority', label: 'Priority', type: 'badge' }
      ],
      fields: [
        { name: 'resident', label: 'Resident / Lead Name', type: 'text', required: true },
        { name: 'task', label: 'Task Description', type: 'text', required: true },
        { name: 'property', label: 'Property', type: 'select', options: ['The Alder', 'Marlowe Court', 'Juniper Flats', 'Beacon Yard'] },
        { name: 'due', label: 'Due Date', type: 'text', required: true, placeholder: 'Today' },
        { name: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium'] }
      ]
    },
    properties: {
      title: 'Properties',
      singular: 'Property',
      subtitle: 'Portfolio buildings',
      statuses: [],
      columns: [],
      fields: [
        { name: 'name', label: 'Building Name', type: 'text', required: true },
        { name: 'neighborhood', label: 'Neighborhood', type: 'text', required: true },
        { name: 'units', label: 'Total Units', type: 'number', required: true },
        { name: 'occupancy', label: 'Occupancy %', type: 'text', required: true, placeholder: '96.0%' },
        { name: 'avgRent', label: 'Average Rent', type: 'text', required: true, placeholder: '$2,500' },
        { name: 'image', label: 'Building Photo URL', type: 'url', required: true, placeholder: 'https://images.unsplash.com/...' }
      ]
    },
    aiConversations: {
      title: 'AI Escalation',
      singular: 'Escalation',
      subtitle: 'Create simulated AI escalation',
      statuses: [],
      columns: [],
      fields: [
        { name: 'name', label: 'Prospect Name', type: 'text', required: true },
        { name: 'property', label: 'Property', type: 'select', options: ['Marlowe Court', 'Juniper Flats', 'Beacon Yard', 'The Alder'] },
        { name: 'tag', label: 'Escalation Tag', type: 'select', options: ['Pricing exception', 'Screening question', 'Asked for a person'] },
        { name: 'intent', label: 'Intent', type: 'select', options: ['High intent', 'Medium intent'] },
        { name: 'fullMessage', label: 'Prospect Message', type: 'text', required: true }
      ]
    }
  };
  return configs[entity];
}

function openCreateModal(entity, prefill = {}) {
  const config = getEntityConfig(entity);
  currentModalContext = { mode: 'create', entity, id: null };
  document.getElementById('modal-title').textContent = `Add New ${config.singular}`;
  document.getElementById('modal-subtitle').textContent = config.subtitle;
  document.getElementById('modal-submit-btn').textContent = `Create ${config.singular}`;
  renderModalFields(config.fields, prefill);
  showModal();
}

function openEditModal(entity, id) {
  const config = getEntityConfig(entity);
  const item = state[entity].find(r => r.id === id);
  if (!item) return;
  currentModalContext = { mode: 'edit', entity, id };
  document.getElementById('modal-title').textContent = `Edit ${config.singular}`;
  document.getElementById('modal-subtitle').textContent = `Updating record ${id}`;
  document.getElementById('modal-submit-btn').textContent = 'Save Changes';
  renderModalFields(config.fields, item);
  showModal();
}

function renderModalFields(fields, values) {
  const container = document.getElementById('modal-fields');
  container.innerHTML = fields.map(f => {
    const val = values[f.name] ?? '';
    if (f.type === 'select') {
      return `
        <div>
          <label class="block text-[11.5px] font-semibold text-obsidian mb-1">${f.label}</label>
          <select name="${f.name}" class="w-full bg-recessed border border-borderSubtle focus:border-indigoPrimary focus:bg-white rounded-xl px-3.5 py-2 text-[12.5px] text-obsidian focus:outline-none">
            ${f.options.map(opt => `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
      `;
    }
    return `
      <div>
        <label class="block text-[11.5px] font-semibold text-obsidian mb-1">${f.label}</label>
        <input
          type="${f.type}"
          name="${f.name}"
          value="${String(val).replace(/"/g, '&quot;')}"
          placeholder="${f.placeholder || ''}"
          ${f.required ? 'required' : ''}
          class="w-full bg-recessed border border-borderSubtle focus:border-indigoPrimary focus:bg-white rounded-xl px-3.5 py-2 text-[12.5px] text-obsidian focus:outline-none"
        />
      </div>
    `;
  }).join('');
}

function handleModalSubmit(e) {
  e.preventDefault();
  if (!currentModalContext) return;
  const { mode, entity, id } = currentModalContext;
  const formData = new FormData(e.target);
  const payload = {};
  formData.forEach((value, key) => {
    payload[key] = key === 'daysLeft' || key === 'score' || key === 'units' ? Number(value) : value.trim();
  });

  if (mode === 'create') {
    const newId = `${entity.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`;
    if (entity === 'leads' && !payload.avatar) {
      payload.avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
    }
    if (entity === 'aiConversations') {
      payload.initials = payload.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      payload.snippet = `"${payload.fullMessage.slice(0, 36)}..."`;
      payload.timeAgo = 'Just now';
      payload.avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80';
      payload.resolved = false;
    }
    state[entity].unshift({ id: newId, ...payload });
    showToast('New record created & KPIs synchronized', 'emerald');
  } else {
    const idx = state[entity].findIndex(r => r.id === id);
    if (idx !== -1) {
      state[entity][idx] = { ...state[entity][idx], ...payload };
      showToast('Record updated successfully', 'indigo');
    }
  }

  saveState();
  closeModal();
  renderApp();
}

function openConversationReview(id) {
  const conv = state.aiConversations.find(c => c.id === id);
  if (!conv) return;
  currentModalContext = { mode: 'review', entity: 'aiConversations', id };
  document.getElementById('modal-title').textContent = `Review AI Escalation · ${conv.name}`;
  document.getElementById('modal-subtitle').textContent = `${conv.property} · ${conv.tag} (${conv.intent})`;
  document.getElementById('modal-submit-btn').textContent = 'Send Reply & Resume AI';
  document.getElementById('modal-fields').innerHTML = `
    <div class="p-3.5 rounded-2xl bg-recessed border border-borderSubtle text-[12.5px] text-obsidian">
      <div class="text-[10.5px] font-bold uppercase text-mutedText mb-1">Prospect Inquiry (${conv.timeAgo})</div>
      ${conv.fullMessage || conv.snippet}
    </div>
    <div>
      <label class="block text-[11.5px] font-semibold text-obsidian mb-1">Leasing Manager Response</label>
      <textarea name="reply" rows="3" required class="w-full bg-white border border-borderSubtle focus:border-indigoPrimary rounded-xl p-3 text-[12.5px] text-obsidian focus:outline-none">Hi ${conv.name.split(' ')[0]}, I'd be happy to help with that directly. Let me apply an exception on our end and send over your updated lease summary right now.</textarea>
    </div>
  `;
  document.getElementById('modal-form').onsubmit = (ev) => {
    ev.preventDefault();
    conv.resolved = true;
    conv.timeAgo = 'Resolved just now';
    saveState();
    closeModal();
    document.getElementById('modal-form').onsubmit = handleModalSubmit;
    renderApp();
    showToast(`Response sent to ${conv.name} & AI resumed`, 'emerald');
  };
  showModal();
}

function bookOpenSlot(slotStr) {
  const [time, meridiem] = slotStr.split(' ');
  openCreateModal('tours', {
    time,
    meridiem,
    property: state.propertyFilter === 'ALL' ? 'The Alder' : state.propertyFilter,
    type: 'Agent-led',
    status: 'Confirmed'
  });
}

function confirmSingleDelete(entity, id) {
  document.getElementById('confirm-message').textContent = 'Delete this record permanently? Dashboard counters and pipeline stages will recalculate automatically.';
  const btn = document.getElementById('confirm-delete-btn');
  btn.onclick = () => {
    state[entity] = state[entity].filter(item => item.id !== id);
    state.selectedRows = state.selectedRows.filter(rid => rid !== id);
    saveState();
    closeConfirmModal();
    renderApp();
    showToast('Record deleted', 'rose');
  };
  document.getElementById('confirm-modal').classList.remove('hidden');
  document.getElementById('confirm-modal').classList.add('flex');
}

function confirmBulkDelete(entity) {
  const count = state.selectedRows.length;
  document.getElementById('confirm-message').textContent = `Delete ${count} selected records permanently?`;
  const btn = document.getElementById('confirm-delete-btn');
  btn.onclick = () => {
    state[entity] = state[entity].filter(item => !state.selectedRows.includes(item.id));
    state.selectedRows = [];
    saveState();
    closeConfirmModal();
    renderApp();
    showToast(`${count} records deleted`, 'rose');
  };
  document.getElementById('confirm-modal').classList.remove('hidden');
  document.getElementById('confirm-modal').classList.add('flex');
}

function showModal() {
  const m = document.getElementById('crud-modal');
  m.classList.remove('hidden');
  m.classList.add('flex');
}

function closeModal() {
  const m = document.getElementById('crud-modal');
  m.classList.add('hidden');
  m.classList.remove('flex');
  document.getElementById('modal-form').onsubmit = handleModalSubmit;
}

function closeConfirmModal() {
  const m = document.getElementById('confirm-modal');
  m.classList.add('hidden');
  m.classList.remove('flex');
}

// =========================================================================
// 8. INTERACTIVE CONTROLS, ROUTING & ANIMATIONS
// =========================================================================
function navigateTo(route) {
  state.activeRoute = route;
  state.selectedRows = [];
  state.tableState.page = 1;
  state.tableState.search = '';
  if (route !== 'leads') {
    state.tableState.status = 'ALL';
  }
  saveState();
  toggleMobileSidebar(false);
  renderApp();
}

function filterLeadsByStage(stage) {
  state.activeRoute = 'leads';
  state.tableState.status = stage;
  state.tableState.page = 1;
  saveState();
  renderApp();
  showToast(`Filtered pipeline by "${stage}"`, 'indigo');
}

function setPipelineRange(range) {
  state.pipelineRange = range;
  saveState();
  renderApp();
}

function setPropertyFilter(prop) {
  state.propertyFilter = prop;
  document.getElementById('selected-property-label').textContent = prop === 'ALL' ? 'All properties' : prop;
  closeAllDropdowns();
  saveState();
  renderApp();
}

function selectPortfolio(name, sub) {
  document.getElementById('active-portfolio-name').textContent = name;
  document.getElementById('active-portfolio-sub').textContent = sub;
  closeAllDropdowns();
  showToast(`Switched workspace to ${name}`, 'indigo');
}

function handleGlobalSearch(val) {
  state.searchQuery = val;
  renderViewportOnly();
}

function toggleAiAssistant() {
  state.aiEnabled = !state.aiEnabled;
  const dot = document.getElementById('ai-toggle-dot');
  const btn = document.getElementById('ai-toggle-btn');
  if (state.aiEnabled) {
    dot.classList.add('translate-x-4');
    btn.classList.remove('bg-mutedText');
    btn.classList.add('bg-obsidian');
    showToast('VestaFlow AI Leasing Assistant enabled', 'emerald');
  } else {
    dot.classList.remove('translate-x-4');
    btn.classList.remove('bg-obsidian');
    btn.classList.add('bg-mutedText');
    showToast('VestaFlow AI paused globally', 'indigo');
  }
  saveState();
  renderSidebar();
}

function toggleTaskDone(id) {
  const tk = state.tasks.find(t => t.id === id);
  if (tk) {
    tk.done = !tk.done;
    saveState();
    renderApp();
    showToast(tk.done ? `Completed: ${tk.task}` : `Reopened: ${tk.task}`, 'emerald');
  }
}

function updateTableSearch(val) {
  state.tableState.search = val;
  state.tableState.page = 1;
  renderViewportOnly();
}

function updateTableStatus(val) {
  state.tableState.status = val;
  state.tableState.page = 1;
  renderViewportOnly();
}

function toggleTableSort(key) {
  if (state.tableState.sortBy === key) {
    state.tableState.sortDir = state.tableState.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    state.tableState.sortBy = key;
    state.tableState.sortDir = 'asc';
  }
  renderViewportOnly();
}

function changeTablePage(newPage) {
  state.tableState.page = Math.max(1, newPage);
  renderViewportOnly();
}

function toggleRowSelect(id) {
  if (state.selectedRows.includes(id)) {
    state.selectedRows = state.selectedRows.filter(r => r !== id);
  } else {
    state.selectedRows.push(id);
  }
  renderViewportOnly();
}

function toggleSelectAll(checked, ids) {
  state.selectedRows = checked ? [...ids] : [];
  renderViewportOnly();
}

function toggleMobileSidebar(open) {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('mobile-backdrop');
  if (open) {
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  }
}

function toggleDropdown(id) {
  const el = document.getElementById(id);
  const isHidden = el.classList.contains('hidden');
  closeAllDropdowns();
  if (isHidden) el.classList.remove('hidden');
}

function closeAllDropdowns() {
  ['portfolio-menu', 'property-filter-menu', 'notifications-popover'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    closeAllDropdowns();
  }
});

function showToast(message, tone = 'indigo') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const accent =
    tone === 'emerald'
      ? 'bg-emerald-400'
      : tone === 'rose'
        ? 'bg-rose-400'
        : 'bg-citron';
  toast.className = 'pointer-events-auto bg-obsidian text-white px-4 py-2.5 rounded-full shadow-xl border border-white/10 flex items-center gap-2.5 text-[12px] font-medium transform translate-y-2 opacity-0 transition-all duration-300';
  toast.innerHTML = `<span class="w-2 h-2 rounded-full ${accent}"></span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Subtle Count-Up Animation on KPI Numbers
function runCountUpAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.count-up').forEach(el => {
    const raw = el.getAttribute('data-target') || el.textContent.trim();
    const isPct = raw.endsWith('%');
    const num = parseFloat(raw.replace('%', ''));
    if (isNaN(num)) return;
    const duration = 420;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      el.textContent = isPct ? `${current.toFixed(1)}%` : Math.round(current);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = raw;
    }
    requestAnimationFrame(tick);
  });
}

// =========================================================================
// 9. MASTER RENDER PIPELINE
// =========================================================================
function renderViewportOnly() {
  const viewport = document.getElementById('main-viewport');
  const heading = document.getElementById('page-heading');
  const route = state.activeRoute;

  const headings = {
    dashboard: 'Good morning, Jordan',
    leads: 'Leasing Pipeline & Leads',
    conversations: 'AI Conversations',
    tours: 'Tour Schedule',
    applications: 'Applications & Screening',
    renewals: 'Lease Renewals',
    properties: 'Properties',
    tasks: 'Tasks & Follow-ups',
    analytics: 'Portfolio Analytics',
    settings: 'Settings'
  };
  heading.textContent = headings[route] || 'Good morning, Jordan';

  if (route === 'dashboard') {
    viewport.innerHTML = renderDashboardView();
    runCountUpAnimations();
  } else if (['leads', 'tours', 'applications', 'renewals', 'tasks'].includes(route)) {
    viewport.innerHTML = renderCrudResourceView(route);
  } else if (route === 'properties') {
    viewport.innerHTML = renderPropertiesView();
  } else if (route === 'conversations') {
    viewport.innerHTML = renderConversationsView();
  } else if (route === 'analytics') {
    viewport.innerHTML = renderAnalyticsView();
  } else if (route === 'settings') {
    viewport.innerHTML = renderSettingsView();
  }
}

function renderApp() {
  renderSidebar();
  renderViewportOnly();
}

// Boot Application
window.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
