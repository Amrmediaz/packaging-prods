const T = {
  bg:        '#080c14',
  surface:   '#0d1220',
  card:      '#111827',
  cardHi:    '#1a2235',
  accent:    '#4f8ef7',
  accentGlow:'rgba(79,142,247,0.18)',
  danger:    '#f43f5e',
  dangerDim: 'rgba(244,63,94,0.12)',
  success:   '#10b981',
  warn:      '#f59e0b',
  textMain:  '#eef2ff',
  textSub:   '#8899b4',
  textMute:  '#3d4f6b',
  border:    'rgba(255,255,255,0.05)',
  borderHi:  'rgba(79,142,247,0.35)',
  shadow:    '0 24px 48px -12px rgba(0,0,0,0.8)',
};
 const ACTIONS = ['view', 'create', 'edit', 'delete'];

const ROLE_COLORS = [
  { value: '#4f8ef7', label: 'Blue'   },
  { value: '#a78bfa', label: 'Violet' },
  { value: '#10b981', label: 'Emerald'},
  { value: '#f59e0b', label: 'Amber'  },
  { value: '#f43f5e', label: 'Rose'   },
  { value: '#06b6d4', label: 'Cyan'   },
  { value: '#ec4899', label: 'Pink'   },
  { value: '#64748b', label: 'Slate'  },
];

// ─── Module definitions with their OWN specific actions ─────────────────────
const MODULES = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    description: 'Analytics & overview panels',
    actions: [
      { key: 'view',   label: 'View',   color: '#10b981', dim: 'rgba(16,185,129,0.14)'  },
      { key: 'export', label: 'Export', color: '#4f8ef7', dim: 'rgba(79,142,247,0.14)'  },
    ],
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: '🛒',
    description: 'Sales & purchase orders',
    actions: [
      { key: 'view',    label: 'View',    color: '#10b981', dim: 'rgba(16,185,129,0.14)' },
      { key: 'create',  label: 'Create',  color: '#4f8ef7', dim: 'rgba(79,142,247,0.14)' },
      { key: 'approve', label: 'Approve', color: '#a78bfa', dim: 'rgba(167,139,250,0.14)'},
      { key: 'cancel',  label: 'Cancel',  color: '#f43f5e', dim: 'rgba(244,63,94,0.14)'  },
    ],
  },
 
  {
    key: 'users',
    label: 'User Management',
    icon: '🛡️',
    description: 'Accounts, roles & permissions',
    actions: [
      { key: 'view',   label: 'View',   color: '#10b981', dim: 'rgba(16,185,129,0.14)'  },
      { key: 'create', label: 'Create', color: '#4f8ef7', dim: 'rgba(79,142,247,0.14)'  },
      { key: 'edit',   label: 'Edit',   color: '#f59e0b', dim: 'rgba(245,158,11,0.14)'  },
      { key: 'delete', label: 'Delete', color: '#f43f5e', dim: 'rgba(244,63,94,0.14)'   },
      { key: 'roles',  label: 'Manage Roles', color: '#ec4899', dim: 'rgba(236,72,153,0.14)' },
    ],
  },
 
];

const mkPerms = (all = false) =>
  Object.fromEntries(
    MODULES.map(({ key, actions }) => [
      key,
      Object.fromEntries(actions.map(a => [a.key, all])),
    ])
  );

const totalPerms = MODULES.reduce((sum, m) => sum + m.actions.length, 0);

function countGranted(permissions) {
  if (!permissions) return 0;
  return Object.entries(permissions).reduce((sum, [modKey, modVal]) => {
    if (typeof modVal !== 'object') return sum;
    return sum + Object.values(modVal).filter(Boolean).length;
  }, 0);
}

function getModuleGranted(permissions, modKey) {
  const mod = permissions?.[modKey];
  if (!mod) return 0;
  return Object.values(mod).filter(Boolean).length;
}

function getActionMeta(modKey, actionKey) {
  const mod = MODULES.find(m => m.key === modKey);
  return mod?.actions.find(a => a.key === actionKey) || { color: '#94a3b8', dim: 'rgba(148,163,184,0.14)', label: actionKey };
}


export { T, ROLE_COLORS, MODULES , ACTIONS, mkPerms, countGranted, getModuleGranted, getActionMeta , totalPerms };