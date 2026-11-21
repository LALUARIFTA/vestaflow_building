const STORAGE_KEY = 'vestaflow_state_v1';

const DEFAULT_STATE = {
  activeRoute: 'dashboard',
  propertyFilter: 'ALL',
  searchQuery: '',
  pipelineRange: '30 days',
  aiEnabled: true,
  selectedRows: [],
  tableState: {
    search: '',
    status: 'ALL',
    sortBy: 'name',
    sortDir: 'asc',
    page: 1,
    perPage: 6
  },
  leads: [
    { id: 'L-101', name: 'Lena Fischer', email: 'lena.fischer@example.com', property: 'The Alder', unit: '410', stage: 'Tour', source: 'Website', intent: 'High intent', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', updatedAt: '10m ago' },
    { id: 'L-102', name: 'Daniel Okafor', email: 'd.okafor@example.com', property: 'Marlowe Court', unit: '312', stage: 'Applied', source: 'Zillow', intent: 'High intent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', updatedAt: '24m ago' },
    { id: 'L-103', name: 'Priya Shah', email: 'priya.shah@example.com', property: 'Juniper Flats', unit: '118', stage: 'Tour', source: 'Apartments.com', intent: 'Medium intent', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80', updatedAt: '41m ago' },
    { id: 'L-104', name: 'Tom Becker', email: 'tom.becker@example.com', property: 'The Alder', unit: '507', stage: 'Qualified', source: 'Referral', intent: 'Medium intent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', updatedAt: '1h ago' },
    { id: 'L-105', name: 'Marcus Reed', email: 'm.reed@example.com', property: 'Marlowe Court', unit: '204', stage: 'New Lead', source: 'Direct Chat', intent: 'High intent', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', updatedAt: '4m ago' },
    { id: 'L-106', name: 'Aisha Rahman', email: 'aisha.r@example.com', property: 'Juniper Flats', unit: '309', stage: 'Qualified', source: 'Instagram', intent: 'Medium intent', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80', updatedAt: '12m ago' },
    { id: 'L-107', name: 'Kevin Tran', email: 'kevin.tran@example.com', property: 'Beacon Yard', unit: '105', stage: 'New Lead', source: 'Walk-in', intent: 'High intent', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80', updatedAt: '18m ago' },
    { id: 'L-108', name: 'Emily Hart', email: 'emily.hart@example.com', property: 'The Alder', unit: '221', stage: 'Applied', source: 'Website', intent: 'High intent', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80', updatedAt: '2h ago' },
    { id: 'L-109', name: 'Hannah Vance', email: 'h.vance@example.com', property: 'Finch & Ninth', unit: '402', stage: 'Approved', source: 'Zillow', intent: 'High intent', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', updatedAt: '3h ago' },
    { id: 'L-110', name: 'Devon Brooks', email: 'd.brooks@example.com', property: 'Beacon Yard', unit: '610', stage: 'Leased', source: 'Website', intent: 'High intent', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', updatedAt: '5h ago' }
  ],
  tours: [
    { id: 'T-201', time: '10:30', meridiem: 'AM', prospect: 'Lena Fischer', property: 'The Alder', unit: '410', type: 'Agent-led', status: 'Confirmed' },
    { id: 'T-202', time: '12:00', meridiem: 'PM', prospect: 'Daniel Okafor', property: 'Marlowe Court', unit: '312', type: 'Self-guided', status: 'Confirmed' },
    { id: 'T-203', time: '2:30', meridiem: 'PM', prospect: 'Priya Shah', property: 'Juniper Flats', unit: '118', type: 'Virtual', status: 'Scheduled' },
    { id: 'T-204', time: '4:30', meridiem: 'PM', prospect: 'Tom Becker', property: 'The Alder', unit: '507', type: 'Agent-led', status: 'Rescheduled' }
  ],
  openSlots: ['1:00 PM', '3:30 PM', '5:00 PM'],
  aiConversations: [
    {
      id: 'C-301',
      initials: 'MR',
      name: 'Marcus Reed',
      property: 'Marlowe Court',
      snippet: '"Can you waive the application fee..."',
      fullMessage: '"Can you waive the application fee if I sign a 14-month lease for unit 204 this weekend?"',
      tag: 'Pricing exception',
      intent: 'High intent',
      timeAgo: '4 min ago',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
      resolved: false
    },
    {
      id: 'C-302',
      initials: 'AR',
      name: 'Aisha Rahman',
      property: 'Juniper Flats',
      snippet: '"My credit score is around 580. Is t..."',
      fullMessage: '"My credit score is around 580. Is there a co-signer or higher security deposit option available?"',
      tag: 'Screening question',
      intent: 'Medium intent',
      timeAgo: '12 min ago',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      resolved: false
    },
    {
      id: 'C-303',
      initials: 'KT',
      name: 'Kevin Tran',
      property: 'Beacon Yard',
      snippet: '"I need to speak with a person abo..."',
      fullMessage: '"I need to speak with a person about corporate relocation billing and move-in parking permits."',
      tag: 'Asked for a person',
      intent: 'High intent',
      timeAgo: '18 min ago',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      resolved: false
    }
  ],
  applications: [
    { id: 'A-401', applicant: 'Daniel Okafor', property: 'Marlowe Court', unit: '312', missingDoc: 'Proof of income', status: 'Pending', score: 742 },
    { id: 'A-402', applicant: 'Emily Hart', property: 'The Alder', unit: '221', missingDoc: 'Photo ID', status: 'Pending', score: 718 },
    { id: 'A-403', applicant: 'Hannah Vance', property: 'Finch & Ninth', unit: '402', missingDoc: 'Complete', status: 'Approved', score: 785 },
    { id: 'A-404', applicant: 'Liam Gallagher', property: 'Juniper Flats', unit: '214', missingDoc: 'Landlord ref', status: 'Pending', score: 695 }
  ],
  renewals: [
    { id: 'R-501', resident: 'Robert Lang', property: 'Finch & Ninth', unit: '305', daysLeft: 28, currentRent: '$2,450', offerStatus: 'Sent' },
    { id: 'R-502', resident: 'Grace Kim', property: 'Oakline Lofts', unit: '112', daysLeft: 34, currentRent: '$2,190', offerStatus: 'Pending' },
    { id: 'R-503', resident: 'Elena Rostova', property: 'The Alder', unit: '604', daysLeft: 45, currentRent: '$2,820', offerStatus: 'Accepted' }
  ],
  properties: [
    { id: 'P-601', name: 'The Alder', neighborhood: 'North Arts District', units: 84, occupancy: '96.4%', avgRent: '$2,640', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80' },
    { id: 'P-602', name: 'Marlowe Court', neighborhood: 'Midtown West', units: 62, occupancy: '95.1%', avgRent: '$2,390', image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=600&q=80' },
    { id: 'P-603', name: 'Juniper Flats', neighborhood: 'South Commons', units: 56, occupancy: '92.8%', avgRent: '$2,150', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' },
    { id: 'P-604', name: 'Beacon Yard', neighborhood: 'Harbor Quarter', units: 96, occupancy: '97.9%', avgRent: '$2,890', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
    { id: 'P-605', name: 'Finch & Ninth', neighborhood: 'Downtown Core', units: 48, occupancy: '93.7%', avgRent: '$2,510', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=600&q=80' },
    { id: 'P-606', name: 'Oakline Lofts', neighborhood: 'Eastside Historic', units: 40, occupancy: '95.0%', avgRent: '$2,280', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80' }
  ],
  tasks: [
    { id: 'TK-701', resident: 'Sarah Mitchell', task: 'Send tour times', property: 'The Alder', due: 'Today', priority: 'High', done: false },
    { id: 'TK-702', resident: 'Noah Patel', task: 'Post-tour check-in', property: 'Marlowe Court', due: 'Today', priority: 'Medium', done: false },
    { id: 'TK-703', resident: 'Daniel Okafor', task: 'Verify W-2 upload', property: 'Marlowe Court', due: 'Tomorrow', priority: 'High', done: false }
  ]
};
