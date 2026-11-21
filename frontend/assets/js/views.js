// =========================================================================
// 3. SIDEBAR NAVIGATION RENDERER
// =========================================================================
function renderSidebar() {
  const m = computeMetrics();
  const navSections = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid', badge: null }
      ]
    },
    {
      title: 'Leasing journey',
      items: [
        { id: 'leads', label: 'Leads', icon: 'users', badge: m.newLeadsCount },
        { id: 'conversations', label: 'Conversations', icon: 'chat', badge: m.activeConvCount },
        { id: 'tours', label: 'Tours', icon: 'calendar', badge: m.toursCount },
        { id: 'applications', label: 'Applications', icon: 'file', badge: m.appsCount },
        { id: 'renewals', label: 'Renewals', icon: 'refresh', badge: m.renewalsCount }
      ]
    },
    {
      title: 'Workspace',
      items: [
        { id: 'properties', label: 'Properties', icon: 'building', badge: null },
        { id: 'tasks', label: 'Tasks', icon: 'check-square', badge: m.openTasks },
        { id: 'analytics', label: 'Analytics', icon: 'bar-chart', badge: null },
        { id: 'settings', label: 'Settings', icon: 'settings', badge: null }
      ]
    }
  ];

  const navEl = document.getElementById('sidebar-nav');
  navEl.innerHTML = navSections.map((section, idx) => `
    <div class="${idx > 0 ? 'pt-3' : ''}">
      ${section.title ? `<div class="px-2.5 pb-1.5 text-[10.5px] font-medium text-mutedText tracking-wide">${section.title}</div>` : ''}
      <div class="space-y-0.5">
        ${section.items.map(item => {
          const active = state.activeRoute === item.id;
          return `
            <button
              onclick="navigateTo('${item.id}')"
              class="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-[12.5px] font-medium transition-all cursor-pointer ${
                active
                  ? 'bg-obsidian text-white shadow-sm'
                  : 'text-obsidian/80 hover:text-obsidian hover:bg-black/[0.04]'
              }"
            >
              <span class="flex items-center gap-2.5">
                ${getNavIcon(item.icon, active)}
                <span>${item.label}</span>
              </span>
              ${item.badge !== null ? `<span class="text-[11px] tabular-nums ${active ? 'text-citron font-semibold' : 'text-mutedText'}">${item.badge}</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  // Sync AI card numbers
  document.getElementById('ai-status-sub').textContent = `${state.aiEnabled ? 'On' : 'Paused'} · ${m.activeConvCount} chats`;
  document.getElementById('ai-review-count-label').textContent = `${m.waitingAi + 1} need your review`;
}

function getNavIcon(name, active) {
  const cls = `w-4 h-4 ${active ? 'text-citron' : 'text-mutedText'}`;
  const icons = {
    grid: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`,
    users: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    chat: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    calendar: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    file: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    refresh: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    building: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>`,
    'check-square': `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    'bar-chart': `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    settings: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  };
  return icons[name] || '';
}

// =========================================================================
// 4. MAIN DASHBOARD VIEW (1:1 Pixel-Accurate Replica)
// =========================================================================
function renderDashboardView() {
  const m = computeMetrics();
  const filtered = getFilteredData();

  const kpis = [
    { label: 'New leads', value: m.newLeadsCount, delta: '↗ 12%', target: 'leads', highlight: false },
    { label: 'Active conversations', value: m.activeConvCount, delta: '↗ 6', target: 'conversations', highlight: false },
    { label: 'Tours scheduled', value: m.toursCount, delta: '↗ 3', target: 'tours', highlight: false },
    { label: 'Applications', value: m.appsCount, delta: '↗ 4', target: 'applications', highlight: false },
    { label: 'Pending applications', value: m.pendingAppsCount, delta: '↘ 2', target: 'applications', highlight: false },
    { label: 'Renewals due', value: m.renewalsCount, delta: '90 days', target: 'renewals', highlight: false, mutedDelta: true },
    { label: 'Conversion rate', value: `${m.conversionRate}%`, delta: '↗ 1.2', target: 'analytics', highlight: true }
  ];

  return `
    <!-- ROW 1: 7-Column KPI Strip -->
    <section class="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3 animate-enter delay-1">
      ${kpis.map(k => `
        <div
          onclick="navigateTo('${k.target}')"
          class="kpi-card cursor-pointer rounded-2xl p-4 flex flex-col justify-between min-h-[96px] border ${
            k.highlight
              ? 'bg-citron border-[#D2EA62] text-obsidian shadow-card'
              : 'bg-white border-borderSubtle/90 text-obsidian shadow-card'
          }"
        >
          <div class="text-[11.5px] font-medium ${k.highlight ? 'text-obsidian/80' : 'text-mutedText'} leading-snug">
            ${k.label}
          </div>
          <div class="flex items-baseline justify-between gap-2 pt-3">
            <span class="text-[24px] font-bold tracking-[-0.03em] tabular-nums leading-none count-up" data-target="${k.value}">
              ${k.value}
            </span>
            <span class="text-[10.5px] font-semibold tabular-nums ${
              k.highlight
                ? 'text-obsidian/80'
                : k.mutedDelta
                  ? 'text-mutedText font-medium'
                  : 'text-emerald-700'
            }">
              ${k.delta}
            </span>
          </div>
        </div>
      `).join('')}
    </section>

    <!-- ROW 2: Full-Width Leasing Pipeline Funnel -->
    <section class="bg-white border border-borderSubtle/90 rounded-[22px] p-5 shadow-card animate-enter delay-2">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 class="text-[15.5px] font-semibold tracking-[-0.01em] text-obsidian leading-tight">Leasing pipeline</h2>
          <p class="text-[11.5px] text-mutedText mt-0.5">
            New lead to signed lease · ${state.propertyFilter === 'ALL' ? 'all properties' : state.propertyFilter}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Segmented Timeframe Control -->
          <div class="bg-recessed border border-borderSubtle rounded-full p-0.5 flex items-center text-[11.5px] font-medium">
            ${['30 days', 'Quarter', 'Year'].map(range => `
              <button
                onclick="setPipelineRange('${range}')"
                class="px-3 py-1 rounded-full transition-all cursor-pointer ${
                  state.pipelineRange === range
                    ? 'bg-obsidian text-white font-semibold shadow-xs'
                    : 'text-mutedText hover:text-obsidian'
                }"
              >
                ${range}
              </button>
            `).join('')}
          </div>
          <button onclick="openCreateModal('leads')" title="Quick Add Lead to Pipeline" class="w-8 h-8 rounded-full border border-borderSubtle bg-white hover:bg-recessed flex items-center justify-center text-mutedText hover:text-obsidian transition-colors cursor-pointer">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="5" cy="12" r="1.2" />
              <circle cx="12" cy="12" r="1.2" />
              <circle cx="19" cy="12" r="1.2" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 6 Pipeline Stage Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        ${m.pipeline.map((stage, i) => `
          <div onclick="filterLeadsByStage('${stage.key}')" class="stage-card cursor-pointer bg-recessed border border-borderSubtle/80 rounded-2xl p-3.5 flex flex-col justify-between min-h-[138px]">
            <!-- Top Stage Header -->
            <div class="flex items-center justify-between gap-1.5">
              ${
                stage.style === 'pill-citron'
                  ? `<span class="px-2.5 py-0.5 rounded-full bg-citron text-obsidian text-[10.5px] font-bold">${stage.key}</span>`
                  : stage.style === 'pill-dark'
                    ? `<span class="px-2.5 py-0.5 rounded-full bg-obsidian text-white text-[10.5px] font-semibold">${stage.key}</span>`
                    : `<span class="flex items-center gap-1.5 text-[11.5px] font-medium text-obsidian/85">
                        <span class="w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-indigoPrimary' : i === 2 ? 'bg-sky-500' : i === 3 ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
                        ${stage.key}
                      </span>`
              }
              <span class="text-[10.5px] font-medium text-mutedText tabular-nums">${stage.badge}</span>
            </div>

            <!-- Middle Visual Bar (Hatched vs Solid Leased Bar) -->
            <div class="my-3 h-7 flex items-end">
              ${
                stage.key === 'Leased'
                  ? `<div class="w-full h-2.5 bg-borderSubtle/60 rounded-full overflow-hidden flex items-center">
                       <div class="h-full bg-citron border border-[#C8E052] rounded-full progress-fill" style="width: ${stage.widthPct}%"></div>
                     </div>`
                  : `<div class="h-7 rounded-lg ${i === 0 ? 'hatched-bar' : 'hatched-bar-indigo'} progress-fill" style="width: ${stage.widthPct}%"></div>`
              }
            </div>

            <!-- Bottom Stage Figure -->
            <div class="flex items-baseline gap-1.5">
              <span class="text-[22px] font-bold tracking-[-0.03em] text-obsidian tabular-nums leading-none">${stage.count}</span>
              <span class="text-[11px] text-mutedText">${stage.unit}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- ROW 3: Bottom 3-Column Bento Grid -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-enter delay-3">

      <!-- Column 1: Today's Tours (4 cols) -->
      <div class="lg:col-span-4 bg-white border border-borderSubtle/90 rounded-[22px] p-5 shadow-card flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3.5">
            <h3 class="text-[15px] font-semibold tracking-[-0.01em] text-obsidian">Today's tours</h3>
            <button onclick="navigateTo('tours')" class="text-[11.5px] font-medium text-mutedText hover:text-indigoPrimary transition-colors cursor-pointer">
              All tours &gt;
            </button>
          </div>

          <div class="divide-y divide-borderSubtle/70">
            ${filtered.tours.slice(0, 4).map(tour => {
              const badgeStyle =
                tour.status === 'Confirmed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70 dot-emerald'
                  : tour.status === 'Scheduled'
                    ? 'bg-indigoSoft text-indigoPrimary border-indigoPrimary/20 dot-indigo'
                    : 'bg-amber-50 text-amber-700 border-amber-200/70 dot-amber';
              const dotColor =
                tour.status === 'Confirmed'
                  ? 'bg-emerald-500'
                  : tour.status === 'Scheduled'
                    ? 'bg-indigoPrimary'
                    : 'bg-amber-500';
              return `
                <div onclick="openEditModal('tours', '${tour.id}')" class="py-2.5 first:pt-1 flex items-center justify-between gap-2.5 hover:bg-recessed/60 -mx-2 px-2 rounded-xl transition-colors cursor-pointer">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-11 shrink-0 tabular-nums">
                      <div class="text-[12.5px] font-bold text-obsidian leading-tight">${tour.time}</div>
                      <div class="text-[10px] font-medium text-mutedText leading-tight mt-0.5">${tour.meridiem}</div>
                    </div>
                    <div class="min-w-0">
                      <div class="text-[12.5px] font-semibold text-obsidian truncate leading-tight">${tour.prospect}</div>
                      <div class="text-[11px] text-mutedText truncate mt-0.5">${tour.property} · ${tour.unit} · ${tour.type}</div>
                    </div>
                  </div>
                  <span class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-medium ${badgeStyle}">
                    <span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span>
                    ${tour.status}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Open Slots Today Sub-Box -->
        <div class="mt-4 bg-recessed border border-borderSubtle/80 rounded-2xl p-3.5">
          <div class="text-[11px] font-medium text-mutedText mb-2">Open slots today</div>
          <div class="flex flex-wrap items-center gap-2">
            ${state.openSlots.map(slot => `
              <button
                onclick="bookOpenSlot('${slot}')"
                class="px-3 py-1.5 rounded-full bg-white hover:bg-obsidian hover:text-white border border-borderSubtle text-[11px] font-semibold text-obsidian shadow-2xs transition-all cursor-pointer tabular-nums"
              >
                + ${slot}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Column 2: AI Conversations to Review (4 cols) -->
      <div class="lg:col-span-4 bg-white border border-borderSubtle/90 rounded-[22px] p-5 shadow-card flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-2 mb-3.5">
            <div>
              <h3 class="text-[15px] font-semibold tracking-[-0.01em] text-obsidian leading-tight">AI conversations to review</h3>
              <p class="text-[11px] text-mutedText mt-0.5">The assistant paused these for your call</p>
            </div>
            <span class="shrink-0 px-2.5 py-1 rounded-full bg-citron text-obsidian text-[10.5px] font-bold">
              ${m.waitingAi + 1} waiting
            </span>
          </div>

          <div class="divide-y divide-borderSubtle/70">
            ${filtered.conversations.slice(0, 3).map(conv => `
              <div class="py-3 first:pt-1 last:pb-0">
                <div class="flex items-start justify-between gap-2.5">
                  <div class="flex items-start gap-2.5 min-w-0">
                    <div class="w-8 h-8 rounded-full bg-recessed border border-borderSubtle overflow-hidden shrink-0 flex items-center justify-center mt-0.5">
                      <img
                        src="${conv.avatar}"
                        alt="${conv.name}"
                        class="w-full h-full object-cover"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                      />
                      <span class="hidden w-full h-full items-center justify-center text-[10.5px] font-bold text-obsidian">${conv.initials}</span>
                    </div>
                    <div class="min-w-0">
                      <div class="text-[12.5px] font-semibold text-obsidian truncate">
                        ${conv.name} <span class="font-normal text-mutedText">· ${conv.property}</span>
                      </div>
                      <p class="text-[11.5px] text-mutedText truncate mt-0.5">${conv.snippet}</p>
                    </div>
                  </div>
                  <button
                    onclick="openConversationReview('${conv.id}')"
                    class="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-obsidian hover:text-white border border-borderSubtle text-[11px] font-semibold text-obsidian transition-colors cursor-pointer"
                  >
                    ${conv.resolved ? 'Reviewed' : 'Review'}
                  </button>
                </div>

                <!-- Bottom Intent & Tag Row -->
                <div class="flex items-center justify-between gap-2 mt-2 pl-10">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-citron/75 text-obsidian text-[10px] font-semibold">
                      <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                        <line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                      ${conv.tag}
                    </span>
                    <span class="inline-flex items-center gap-1 text-[10.5px] font-semibold text-obsidian/80">
                      <svg class="w-3 h-3 text-indigoPrimary" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="3" y="14" width="3.5" height="6" rx="1"/>
                        <rect x="9.5" y="9" width="3.5" height="11" rx="1"/>
                        <rect x="16" y="4" width="3.5" height="16" rx="1"/>
                      </svg>
                      ${conv.intent}
                    </span>
                  </div>
                  <span class="text-[10px] text-mutedText tabular-nums shrink-0">${conv.timeAgo}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Column 3: Stacked Operational Action Cards (4 cols) -->
      <div class="lg:col-span-4 flex flex-col justify-between gap-3">

        <!-- Mini Card 1: Applications missing information -->
        <div class="bg-white border border-borderSubtle/90 rounded-[20px] p-4 shadow-card">
          <div class="flex items-center justify-between mb-2.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </span>
              <h4 class="text-[12.5px] font-semibold text-obsidian">Applications missing information</h4>
            </div>
            <button onclick="navigateTo('applications')" class="text-[11px] font-medium text-mutedText hover:text-indigoPrimary cursor-pointer">5 &gt;</button>
          </div>
          <div class="divide-y divide-borderSubtle/60">
            ${filtered.applications.filter(a => a.status === 'Pending').slice(0, 2).map(app => `
              <div onclick="openEditModal('applications', '${app.id}')" class="py-2 last:pb-0 flex items-center justify-between gap-2 text-[11.5px] hover:bg-recessed/60 -mx-1.5 px-1.5 rounded-lg cursor-pointer transition-colors">
                <div class="truncate">
                  <span class="font-semibold text-obsidian">${app.applicant}</span>
                  <span class="text-mutedText"> · ${app.property} ${app.unit}</span>
                </div>
                <span class="text-mutedText text-[11px] shrink-0">${app.missingDoc}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Mini Card 2: Renewals due soon -->
        <div class="bg-white border border-borderSubtle/90 rounded-[20px] p-4 shadow-card">
          <div class="flex items-center justify-between mb-2.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-indigoSoft text-indigoPrimary flex items-center justify-center">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </span>
              <h4 class="text-[12.5px] font-semibold text-obsidian">Renewals due soon</h4>
            </div>
            <button onclick="navigateTo('renewals')" class="text-[11px] font-medium text-mutedText hover:text-indigoPrimary cursor-pointer">6 &gt;</button>
          </div>
          <div class="divide-y divide-borderSubtle/60">
            ${filtered.renewals.slice(0, 2).map(ren => `
              <div onclick="openEditModal('renewals', '${ren.id}')" class="py-2 last:pb-0 flex items-center justify-between gap-2 text-[11.5px] hover:bg-recessed/60 -mx-1.5 px-1.5 rounded-lg cursor-pointer transition-colors">
                <div class="truncate">
                  <span class="font-semibold text-obsidian">${ren.resident}</span>
                  <span class="text-mutedText"> · ${ren.property} ${ren.unit}</span>
                </div>
                <span class="text-mutedText text-[11px] tabular-nums shrink-0">${ren.daysLeft} days left</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Mini Card 3: Follow-ups due -->
        <div class="bg-white border border-borderSubtle/90 rounded-[20px] p-4 shadow-card">
          <div class="flex items-center justify-between mb-2.5">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-recessed text-obsidian flex items-center justify-center">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </span>
              <h4 class="text-[12.5px] font-semibold text-obsidian">Follow-ups due</h4>
            </div>
            <button onclick="navigateTo('tasks')" class="text-[11px] font-medium text-mutedText hover:text-indigoPrimary cursor-pointer">8 &gt;</button>
          </div>
          <div class="divide-y divide-borderSubtle/60">
            ${filtered.tasks.slice(0, 2).map(tk => `
              <div onclick="toggleTaskDone('${tk.id}')" class="py-2 last:pb-0 flex items-center justify-between gap-2 text-[11.5px] hover:bg-recessed/60 -mx-1.5 px-1.5 rounded-lg cursor-pointer transition-colors">
                <div class="truncate ${tk.done ? 'line-through opacity-50' : ''}">
                  <span class="font-semibold text-obsidian">${tk.resident}</span>
                  <span class="text-mutedText"> · ${tk.task}</span>
                </div>
                <span class="text-mutedText text-[11px] shrink-0">${tk.done ? 'Done' : tk.due}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </section>
  `;
}

// =========================================================================
// 5. FULL CRUD DATA TABLE & PORTFOLIO VIEWS (Sub-Menus)
// =========================================================================
function renderCrudResourceView(entity) {
  const config = getEntityConfig(entity);
  let items = [...state[entity]];

  // Filter by global property selector
  if (state.propertyFilter !== 'ALL') {
    items = items.filter(i => (i.property || i.name) === state.propertyFilter);
  }

  // Filter by table search & status
  const q = (state.tableState.search || state.searchQuery).trim().toLowerCase();
  if (q) {
    items = items.filter(item =>
      Object.values(item).some(val => String(val).toLowerCase().includes(q))
    );
  }
  if (state.tableState.status !== 'ALL') {
    items = items.filter(item => (item.stage || item.status || item.offerStatus || item.priority) === state.tableState.status);
  }

  // Sorting
  const { sortBy, sortDir, page, perPage } = state.tableState;
  items.sort((a, b) => {
    const valA = String(a[sortBy] ?? '').toLowerCase();
    const valB = String(b[sortBy] ?? '').toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = items.slice((safePage - 1) * perPage, safePage * perPage);

  return `
    <section class="bg-white border border-borderSubtle rounded-[22px] p-5 shadow-card animate-enter">
      <!-- Table Header & Actions -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-borderSubtle">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-[17px] font-bold text-obsidian">${config.title}</h2>
            <span class="px-2.5 py-0.5 rounded-full bg-indigoSoft text-indigoPrimary text-[11px] font-bold tabular-nums">${totalItems} total</span>
          </div>
          <p class="text-[12px] text-mutedText mt-0.5">${config.subtitle}</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          ${state.selectedRows.length > 0 ? `
            <button onclick="confirmBulkDelete('${entity}')" class="px-3.5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[12px] font-semibold transition-colors cursor-pointer">
              Delete Selected (${state.selectedRows.length})
            </button>
          ` : ''}
          <button onclick="navigateTo('dashboard')" class="px-3.5 py-2 rounded-full border border-borderSubtle bg-recessed hover:bg-white text-[12px] font-semibold text-obsidian transition-colors cursor-pointer">
            ← Overview
          </button>
          <button onclick="openCreateModal('${entity}')" class="px-4 py-2 rounded-full bg-obsidian hover:bg-indigoPrimary text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-card transition-colors cursor-pointer">
            <span class="text-citron text-[15px] leading-none font-bold">+</span>
            <span>Add ${config.singular}</span>
          </button>
        </div>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2.5 flex-1">
          <input
            type="text"
            value="${state.tableState.search}"
            oninput="updateTableSearch(this.value)"
            placeholder="Filter ${config.title.toLowerCase()}..."
            class="w-full sm:w-64 bg-recessed border border-borderSubtle focus:border-indigoPrimary focus:bg-white rounded-full px-3.5 py-1.5 text-[12px] text-obsidian focus:outline-none transition-all"
          />
          <select
            onchange="updateTableStatus(this.value)"
            class="bg-recessed border border-borderSubtle rounded-full px-3.5 py-1.5 text-[12px] font-medium text-obsidian focus:outline-none focus:border-indigoPrimary"
          >
            <option value="ALL">All Statuses</option>
            ${config.statuses.map(st => `<option value="${st}" ${state.tableState.status === st ? 'selected' : ''}>${st}</option>`).join('')}
          </select>
        </div>
        <div class="text-[11.5px] text-mutedText">
          Click column headers to sort · Changes sync live to Dashboard KPIs
        </div>
      </div>

      <!-- Responsive Horizontal Scroll Table Wrapper -->
      <div class="overflow-x-auto border border-borderSubtle/80 rounded-2xl">
        <table class="w-full text-left border-collapse min-w-[740px]">
          <thead>
            <tr class="bg-recessed/90 border-b border-borderSubtle text-[11px] font-semibold text-mutedText uppercase tracking-wider">
              <th class="py-3 pl-4 pr-2 w-10">
                <input type="checkbox" onchange="toggleSelectAll(this.checked, ${JSON.stringify(paginated.map(i => i.id)).replace(/"/g, '&quot;')})" class="rounded border-borderSubtle text-indigoPrimary focus:ring-indigoPrimary" />
              </th>
              ${config.columns.map(col => `
                <th onclick="toggleTableSort('${col.key}')" class="py-3 px-3 cursor-pointer hover:text-obsidian select-none">
                  <div class="inline-flex items-center gap-1">
                    <span>${col.label}</span>
                    <span class="text-[10px]">${state.tableState.sortBy === col.key ? (state.tableState.sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                  </div>
                </th>
              `).join('')}
              <th class="py-3 pl-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-borderSubtle/70 text-[12.5px]">
            ${
              paginated.length === 0
                ? `<tr><td colspan="${config.columns.length + 2}" class="py-10 text-center text-mutedText">No matching records found. Try adjusting your search or adding a new ${config.singular.toLowerCase()}.</td></tr>`
                : paginated.map(row => `
                  <tr class="hover:bg-recessed/50 transition-colors">
                    <td class="py-3 pl-4 pr-2">
                      <input
                        type="checkbox"
                        ${state.selectedRows.includes(row.id) ? 'checked' : ''}
                        onchange="toggleRowSelect('${row.id}')"
                        class="rounded border-borderSubtle text-indigoPrimary focus:ring-indigoPrimary"
                      />
                    </td>
                    ${config.columns.map((col, idx) => `
                      <td class="py-3 px-3 ${idx === 0 ? 'font-semibold text-obsidian' : 'text-obsidian/85'}">
                        ${renderCellContent(col, row)}
                      </td>
                    `).join('')}
                    <td class="py-3 pl-3 pr-4 text-right whitespace-nowrap">
                      <button onclick="openEditModal('${entity}', '${row.id}')" class="px-2.5 py-1 rounded-full border border-borderSubtle bg-white hover:bg-indigoSoft hover:text-indigoPrimary hover:border-indigoPrimary/30 text-[11px] font-semibold transition-colors mr-1 cursor-pointer">
                        Edit
                      </button>
                      <button onclick="confirmSingleDelete('${entity}', '${row.id}')" class="px-2.5 py-1 rounded-full border border-borderSubtle bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-[11px] font-semibold transition-colors cursor-pointer">
                        Delete
                      </button>
                    </td>
                  </tr>
                `).join('')
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="pt-4 flex flex-wrap items-center justify-between gap-3 text-[12px]">
        <div class="text-mutedText tabular-nums">
          Showing <span class="font-semibold text-obsidian">${totalItems === 0 ? 0 : (safePage - 1) * perPage + 1}</span>–<span class="font-semibold text-obsidian">${Math.min(safePage * perPage, totalItems)}</span> of <span class="font-semibold text-obsidian">${totalItems}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            onclick="changeTablePage(${safePage - 1})"
            ${safePage <= 1 ? 'disabled' : ''}
            class="px-3 py-1.5 rounded-full border border-borderSubtle text-[11.5px] font-semibold disabled:opacity-40 hover:bg-recessed cursor-pointer"
          >
            Previous
          </button>
          <span class="px-3 py-1 rounded-full bg-obsidian text-white text-[11.5px] font-semibold tabular-nums">
            ${safePage} / ${totalPages}
          </span>
          <button
            onclick="changeTablePage(${safePage + 1})"
            ${safePage >= totalPages ? 'disabled' : ''}
            class="px-3 py-1.5 rounded-full border border-borderSubtle text-[11.5px] font-semibold disabled:opacity-40 hover:bg-recessed cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderCellContent(col, row) {
  const val = row[col.key] ?? '—';
  if (col.type === 'person') {
    const initials = String(val).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-full bg-indigoSoft border border-borderSubtle overflow-hidden shrink-0 flex items-center justify-center">
          ${row.avatar ? `<img src="${row.avatar}" alt="${val}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` : ''}
          <span class="${row.avatar ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-[10px] font-bold text-indigoPrimary">${initials}</span>
        </div>
        <div>
          <div class="leading-tight">${val}</div>
          ${row.email ? `<div class="text-[10.5px] font-normal text-mutedText">${row.email}</div>` : ''}
        </div>
      </div>
    `;
  }
  if (col.type === 'badge') {
    const isPositive = ['Leased', 'Approved', 'Confirmed', 'Accepted', 'Complete'].includes(val);
    const isHighlight = ['New Lead', 'High intent', 'Pending', 'Scheduled'].includes(val);
    const badgeCls = isPositive
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : isHighlight
        ? 'bg-citron/80 text-obsidian border-[#D2EA62]'
        : 'bg-recessed text-obsidian/80 border-borderSubtle';
    return `<span class="inline-flex px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${badgeCls}">${val}</span>`;
  }
  return `<span class="tabular-nums">${val}</span>`;
}

// =========================================================================
// 6. SECONDARY VIEWS: PROPERTIES GRID, CONVERSATIONS, ANALYTICS, SETTINGS
// =========================================================================
function renderPropertiesView() {
  const props = state.properties;
  return `
    <section class="space-y-4 animate-enter">
      <div class="bg-white border border-borderSubtle rounded-[22px] p-5 shadow-card flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-[17px] font-bold text-obsidian">Crestline Portfolio Properties</h2>
          <p class="text-[12px] text-mutedText mt-0.5">Active multifamily assets, live occupancy rates, and average effective rents.</p>
        </div>
        <button onclick="openCreateModal('properties')" class="px-4 py-2 rounded-full bg-obsidian hover:bg-indigoPrimary text-white text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
          <span class="text-citron font-bold">+</span> Add Property
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        ${props.map(p => `
          <div class="bg-white border border-borderSubtle rounded-[22px] overflow-hidden shadow-card kpi-card flex flex-col justify-between">
            <div>
              <div class="h-44 w-full bg-recessed relative overflow-hidden">
                <img
                  src="${p.image}"
                  alt="${p.name}"
                  class="w-full h-full object-cover"
                  onerror="this.src='https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'"
                />
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-obsidian/85 backdrop-blur-xs text-citron text-[11px] font-bold tabular-nums">
                  ${p.occupancy} occupied
                </span>
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="text-[15px] font-bold text-obsidian">${p.name}</h3>
                    <p class="text-[11.5px] text-mutedText">${p.neighborhood}</p>
                  </div>
                  <span class="text-[13px] font-bold text-indigoPrimary tabular-nums">${p.avgRent}/mo</span>
                </div>
              </div>
            </div>
            <div class="px-4 pb-4 pt-2 border-t border-borderSubtle/70 flex items-center justify-between text-[11.5px]">
              <span class="text-mutedText font-medium tabular-nums">${p.units} total units</span>
              <div class="flex items-center gap-1.5">
                <button onclick="setPropertyFilter('${p.name}'); navigateTo('dashboard');" class="px-3 py-1 rounded-full bg-recessed hover:bg-citron text-obsidian font-semibold transition-colors cursor-pointer">
                  Filter KPIs
                </button>
                <button onclick="openEditModal('properties', '${p.id}')" class="px-2.5 py-1 rounded-full border border-borderSubtle hover:bg-recessed font-semibold cursor-pointer">
                  Edit
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderConversationsView() {
  return `
    <section class="bg-white border border-borderSubtle rounded-[22px] p-5 shadow-card animate-enter space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-borderSubtle">
        <div>
          <h2 class="text-[17px] font-bold text-obsidian">VestaFlow AI Escalation Queue</h2>
          <p class="text-[12px] text-mutedText mt-0.5">Conversations automatically paused by the leasing assistant for human judgment.</p>
        </div>
        <button onclick="openCreateModal('aiConversations')" class="px-4 py-2 rounded-full bg-obsidian hover:bg-indigoPrimary text-white text-[12px] font-semibold cursor-pointer">
          + Simulate Escalation
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        ${state.aiConversations.map(c => `
          <div class="border border-borderSubtle rounded-2xl p-4 bg-recessed/50 flex flex-col justify-between gap-3">
            <div>
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <img src="${c.avatar}" alt="${c.name}" class="w-9 h-9 rounded-full object-cover border border-borderSubtle" onerror="this.style.display='none'" />
                  <div>
                    <div class="text-[13px] font-bold text-obsidian">${c.name} · <span class="font-normal text-mutedText">${c.property}</span></div>
                    <div class="text-[11px] text-mutedText">${c.timeAgo} · ${c.intent}</div>
                  </div>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${c.resolved ? 'bg-emerald-100 text-emerald-800' : 'bg-citron text-obsidian'}">
                  ${c.resolved ? 'Resolved' : c.tag}
                </span>
              </div>
              <p class="mt-3 text-[12.5px] text-obsidian bg-white p-3 rounded-xl border border-borderSubtle/80">${c.fullMessage || c.snippet}</p>
            </div>
            <div class="flex items-center justify-end gap-2">
              <button onclick="openConversationReview('${c.id}')" class="px-3.5 py-1.5 rounded-full bg-obsidian hover:bg-indigoPrimary text-white text-[11.5px] font-semibold cursor-pointer">
                ${c.resolved ? 'View Response' : 'Respond & Resolve'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAnalyticsView() {
  const m = computeMetrics();
  const channels = [
    { name: 'Property Website & Direct', leads: 54, conv: '11.2%', pct: 82 },
    { name: 'Zillow & StreetEasy Network', leads: 36, conv: '8.4%', pct: 64 },
    { name: 'Apartments.com Syndication', leads: 23, conv: '7.1%', pct: 46 },
    { name: 'Resident Referrals & Walk-ins', leads: 15, conv: '14.6%', pct: 34 }
  ];
  return `
    <section class="space-y-4 animate-enter">
      <div class="bg-white border border-borderSubtle rounded-[22px] p-5 shadow-card">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-[17px] font-bold text-obsidian">Leasing Velocity & Channel Attribution</h2>
            <p class="text-[12px] text-mutedText mt-0.5">Live conversion performance across your active portfolio (${m.conversionRate}% overall rate).</p>
          </div>
          <button onclick="navigateTo('dashboard')" class="px-3.5 py-1.5 rounded-full border border-borderSubtle text-[12px] font-semibold hover:bg-recessed cursor-pointer">← Dashboard</button>
        </div>
        <div class="space-y-3.5">
          ${channels.map(ch => `
            <div class="p-3.5 rounded-2xl bg-recessed border border-borderSubtle/80">
              <div class="flex items-center justify-between text-[12.5px] font-semibold text-obsidian mb-2">
                <span>${ch.name}</span>
                <span class="tabular-nums">${ch.leads} leads · <span class="text-indigoPrimary">${ch.conv} lease rate</span></span>
              </div>
              <div class="h-3 rounded-full bg-white border border-borderSubtle overflow-hidden">
                <div class="h-full bg-indigoPrimary rounded-full progress-fill" style="width: ${ch.pct}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderSettingsView() {
  return `
    <section class="bg-white border border-borderSubtle rounded-[22px] p-6 shadow-card animate-enter max-w-2xl space-y-5">
      <div>
        <h2 class="text-[17px] font-bold text-obsidian">Workspace & Data Controls</h2>
        <p class="text-[12px] text-mutedText mt-0.5">Manage local persistence, AI escalation thresholds, and portfolio defaults.</p>
      </div>
      <div class="p-4 rounded-2xl bg-recessed border border-borderSubtle flex items-center justify-between gap-4">
        <div>
          <div class="text-[13px] font-bold text-obsidian">Local Browser Persistence (localStorage)</div>
          <div class="text-[11.5px] text-mutedText mt-0.5">All created leads, booked tours, and edits are saved automatically in your browser.</div>
        </div>
        <button onclick="resetDemoData()" class="shrink-0 px-4 py-2 rounded-full bg-obsidian hover:bg-rose-600 text-white text-[12px] font-semibold transition-colors cursor-pointer">
          Reset Data
        </button>
      </div>
    </section>
  `;
}
