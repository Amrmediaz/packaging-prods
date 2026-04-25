import { label } from "framer-motion/client";

 const ACTIONS = ['view', 'create', 'edit', 'delete'];



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
    key:'products' ,
    label:'Products' ,

 icon: '🛒',
    description: 'Products',
    actions: [
      { key: 'view',    label: 'View',    color: '#10b981', dim: 'rgba(16,185,129,0.14)' },
      { key: 'create',  label: 'Create',  color: '#4f8ef7', dim: 'rgba(79,142,247,0.14)' },
      { key: 'delete',  label: 'Delete',  color: '#f43f5e', dim: 'rgba(244,63,94,0.14)'  },
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



function actionDescription(modKey, actionKey) {
  const map = {
    dashboard: { view: 'See analytics, KPIs, and summary cards', export: 'Download dashboard data as CSV/PDF' },
    orders: { view: 'Browse and search all orders', create: 'Place new orders', approve: 'Authorize pending orders', cancel: 'Cancel placed orders' },
    inventory: { view: 'Browse stock levels and items', create: 'Add new inventory items', edit: 'Update item details & pricing', delete: 'Remove items from catalog', adjust: 'Manually adjust stock quantities' },
    users: { view: 'Browse user accounts', create: 'Add new user accounts', edit: 'Modify user details', delete: 'Deactivate or remove users', roles: 'Assign and manage roles & permissions' },
    products : {view: 'Browse products', create: 'Add new products', delete: 'Delete products', }
  };
  return map[modKey]?.[actionKey] || '';
}

export {  MODULES , ACTIONS, mkPerms, countGranted, getModuleGranted, getActionMeta , totalPerms , actionDescription };