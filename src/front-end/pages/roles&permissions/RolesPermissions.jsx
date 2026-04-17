

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getRolesRequest,
  createRoleRequest,
  updateRoleRequest,
  deleteRoleRequest,
} from '../../api/role.ap';

// ─── Design Tokens ─────────────────────────────────────────────────────────
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

// ─── Toggle checkbox ──────────────────────────────────────────────────────────
function Checkbox({ on, color, dim, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '32px', height: '32px', borderRadius: '8px', border: 'none',
      background: on ? dim : 'rgba(255,255,255,0.03)',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: on ? `0 0 0 1.5px ${color}50, 0 2px 8px ${color}20` : `0 0 0 1px rgba(255,255,255,0.06)`,
      transition: 'all 0.15s cubic-bezier(.4,0,.2,1)',
      flexShrink: 0,
    }}>
      {on
        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        : <span style={{ width: '6px', height: '6px', borderRadius: '2px', background: T.textMute, display: 'block', opacity: 0.4 }} />
      }
    </button>
  );
}

// ─── Permission Matrix Row ────────────────────────────────────────────────────
function ModulePermRow({ module, perms, onToggle, onToggleAll, readOnly }) {
  const granted = getModuleGranted(perms, module.key);
  const total = module.actions.length;
  const allOn = granted === total;
  const someOn = granted > 0 && !allOn;

  return (
    <div style={{
      padding: '16px 24px',
      borderBottom: `1px solid ${T.border}`,
      background: allOn ? 'rgba(79,142,247,0.025)' : 'transparent',
      transition: 'background 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {/* Module info */}
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!readOnly && (
            <button onClick={() => onToggleAll(module.key)} title={allOn ? 'Revoke all' : 'Grant all'} style={{
              width: '20px', height: '20px', borderRadius: '5px', border: 'none',
              background: allOn ? T.accent : someOn ? 'rgba(79,142,247,0.3)' : 'rgba(255,255,255,0.05)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: allOn ? `0 0 0 1.5px ${T.accent}` : someOn ? `0 0 0 1.5px ${T.accent}60` : `0 0 0 1px rgba(255,255,255,0.1)`,
              transition: 'all 0.15s',
            }}>
              {allOn
                ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : someOn
                ? <span style={{ width: '8px', height: '2px', background: T.accent, display: 'block', borderRadius: '1px' }} />
                : null
              }
            </button>
          )}
          <span style={{ fontSize: '18px' }}>{module.icon}</span>
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: T.textMain }}>{module.label}</p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: T.textMute }}>{module.description}</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
          {module.actions.map(action => {
            const on = perms?.[module.key]?.[action.key] || false;
            return (
              <div key={action.key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {readOnly ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '5px 10px', borderRadius: '20px',
                    background: on ? action.dim : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${on ? action.color + '30' : 'rgba(255,255,255,0.06)'}`,
                    opacity: on ? 1 : 0.4,
                  }}>
                    {on && <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke={action.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
                    <span style={{ fontSize: '11px', fontWeight: 700, color: on ? action.color : T.textMute }}>{action.label}</span>
                  </div>
                ) : (
                  <button onClick={() => onToggle(module.key, action.key)} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 10px', borderRadius: '20px', border: 'none',
                    background: on ? action.dim : 'rgba(255,255,255,0.03)',
                    boxShadow: on ? `0 0 0 1px ${action.color}30` : `0 0 0 1px rgba(255,255,255,0.06)`,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}>
                    <Checkbox on={on} color={action.color} dim={action.dim} onClick={e => { e.stopPropagation(); onToggle(module.key, action.key); }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: on ? action.color : T.textMute, whiteSpace: 'nowrap' }}>
                      {action.label}
                    </span>
                  </button>
                )}
              </div>
            );
          })}

          {/* badge */}
          <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 800, letterSpacing: '0.04em',
            color: allOn ? '#10b981' : someOn ? T.accent : T.textMute,
            background: allOn ? 'rgba(16,185,129,0.12)' : someOn ? T.accentGlow : 'rgba(255,255,255,0.04)',
            padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap',
          }}>
            {granted}/{total}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({ role, onCancel, onConfirm, loading }) {
  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, background: 'rgba(4,8,20,0.9)',
      backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 3000, padding: '20px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.card, border: `1px solid ${T.danger}35`,
        borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '400px',
        boxShadow: `0 32px 64px rgba(0,0,0,0.8), 0 0 0 1px ${T.danger}15`,
        animation: 'modalIn 0.2s cubic-bezier(.34,1.56,.64,1)',
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: T.dangerDim, border: `1px solid ${T.danger}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', marginBottom: '20px',
        }}>🗑️</div>
        <h3 style={{ margin: '0 0 8px', fontSize: '19px', fontWeight: 800, color: T.textMain, letterSpacing: '-0.3px' }}>
          Delete "{role.name}"?
        </h3>
        <p style={{ margin: '0 0 28px', fontSize: '13px', color: T.textSub, lineHeight: 1.7 }}>
          This is permanent and cannot be undone. Users assigned this role will lose access immediately.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px', borderRadius: '10px',
            border: `1px solid ${T.border}`, background: T.cardHi,
            color: T.textSub, fontWeight: 600, cursor: 'pointer',
            fontSize: '13px', fontFamily: 'inherit',
          }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex: 1, padding: '11px', borderRadius: '10px', border: 'none',
            background: loading ? 'rgba(244,63,94,0.35)' : T.danger,
            color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '13px', fontFamily: 'inherit',
            boxShadow: loading ? 'none' : `0 4px 16px rgba(244,63,94,0.4)`,
            transition: 'all 0.2s',
          }}>
            {loading ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Role Form Modal ──────────────────────────────────────────────────────────
function RoleModal({ onClose, onSave, editing, saving }) {
  const [name, setName] = useState(editing?.name || '');
  const [desc, setDesc] = useState(editing?.description || '');
  const [color, setColor] = useState(editing?.color || ROLE_COLORS[0].value);
  const [perms, setPerms] = useState(() => {
    if (editing?.permissions) {
      // Merge: ensure all modules & their new actions exist
      const base = mkPerms(false);
      Object.entries(editing.permissions).forEach(([mod, actions]) => {
        if (base[mod]) Object.entries(actions).forEach(([action, val]) => {
          if (action in base[mod]) base[mod][action] = val;
        });
      });
      return base;
    }
    return mkPerms(false);
  });
  const [activeModule, setActiveModule] = useState(MODULES[0].key);
  const [step, setStep] = useState('details'); // 'details' | 'permissions'

  const togglePerm = (mod, action) =>
    setPerms(p => ({ ...p, [mod]: { ...p[mod], [action]: !p[mod]?.[action] } }));

  const toggleAll = (mod) => {
    const module = MODULES.find(m => m.key === mod);
    const allOn = module.actions.every(a => perms[mod]?.[a.key]);
    setPerms(p => ({
      ...p,
      [mod]: Object.fromEntries(module.actions.map(a => [a.key, !allOn])),
    }));
  };

  const granted = countGranted(perms);
  const isValid = name.trim().length > 0;
  const activeModuleDef = MODULES.find(m => m.key === activeModule);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(4,8,20,0.9)',
      backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 2000, padding: '20px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.card, border: `1px solid ${T.borderHi}`,
        borderRadius: '22px', width: '100%', maxWidth: '780px',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: T.shadow, overflow: 'hidden',
        animation: 'modalIn 0.25s cubic-bezier(.34,1.56,.64,1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '22px 28px', borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: T.cardHi,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: color + '18', border: `1.5px solid ${color}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            }}>🛡️</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: T.textMain, letterSpacing: '-0.3px' }}>
                {editing ? 'Edit Role' : 'New Role'}
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: T.textSub }}>
                <span style={{ color: T.accent, fontWeight: 700 }}>{granted}</span>
                <span style={{ color: T.textMute }}> / {totalPerms} permissions active</span>
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Step tabs */}
            <div style={{
              display: 'flex', background: T.bg, borderRadius: '10px', padding: '3px',
              border: `1px solid ${T.border}`,
            }}>
              {[{ id: 'details', label: 'Details' }, { id: 'permissions', label: 'Permissions' }].map(s => (
                <button key={s.id} onClick={() => setStep(s.id)} style={{
                  padding: '6px 14px', borderRadius: '8px', border: 'none',
                  background: step === s.id ? T.accent : 'transparent',
                  color: step === s.id ? '#fff' : T.textSub,
                  fontWeight: 700, cursor: 'pointer', fontSize: '12px',
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}>{s.label}</button>
              ))}
            </div>
            <button onClick={onClose} style={{
              background: T.bg, border: `1px solid ${T.border}`,
              width: '32px', height: '32px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '16px', color: T.textSub,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {step === 'details' ? (
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto' }}>
              <Field label="Role Name" required>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Warehouse Supervisor"
                  style={inputStyle(!!name)}
                  onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${T.accent}40`}
                  onBlur={e => e.target.style.boxShadow = 'none'}
                />
              </Field>
              <Field label="Description">
                <input value={desc} onChange={e => setDesc(e.target.value)}
                  placeholder="Briefly describe what this role can do…"
                  style={inputStyle(false)}
                  onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${T.accent}40`}
                  onBlur={e => e.target.style.boxShadow = 'none'}
                />
              </Field>
              <Field label="Color Label">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {ROLE_COLORS.map(c => (
                    <button key={c.value} onClick={() => setColor(c.value)} title={c.label} style={{
                      width: '34px', height: '34px', borderRadius: '50%', background: c.value,
                      border: color === c.value ? `3px solid #fff` : '3px solid transparent',
                      cursor: 'pointer', outline: color === c.value ? `2px solid ${c.value}` : 'none',
                      outlineOffset: '2px', transform: color === c.value ? 'scale(1.18)' : 'scale(1)',
                      transition: 'all 0.15s',
                    }} />
                  ))}
                </div>
              </Field>
              {/* Quick summary */}
              <div style={{
                background: T.bg, borderRadius: '14px', padding: '18px 20px',
                border: `1px solid ${T.border}`,
              }}>
                <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: 700, color: T.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Permission Summary
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {MODULES.map(m => {
                    const g = getModuleGranted(perms, m.key);
                    const t = m.actions.length;
                    return (
                      <button key={m.key} onClick={() => { setStep('permissions'); setActiveModule(m.key); }} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '20px', border: 'none',
                        background: g === t ? 'rgba(79,142,247,0.12)' : g > 0 ? 'rgba(245,158,11,0.10)' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                        <span style={{ fontSize: '13px' }}>{m.icon}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: g === t ? T.accent : g > 0 ? T.warn : T.textMute }}>
                          {m.label}
                        </span>
                        <span style={{ fontSize: '10px', color: g === t ? T.accent : g > 0 ? T.warn : T.textMute, opacity: 0.8 }}>
                          {g}/{t}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // ─ Permissions Tab ─────────────────────────────────────────────
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Module sidebar */}
              <div style={{
                width: '180px', flexShrink: 0, borderRight: `1px solid ${T.border}`,
                overflowY: 'auto', background: T.surface, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px',
              }}>
                {MODULES.map(m => {
                  const g = getModuleGranted(perms, m.key);
                  const t = m.actions.length;
                  const isActive = activeModule === m.key;
                  return (
                    <button key={m.key} onClick={() => setActiveModule(m.key)} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 10px', borderRadius: '10px', border: 'none',
                      background: isActive ? T.accentGlow : 'transparent',
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                      boxShadow: isActive ? `inset 0 0 0 1px ${T.accent}30` : 'none',
                      transition: 'all 0.15s',
                    }}>
                      <span style={{ fontSize: '16px' }}>{m.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: isActive ? T.accent : T.textSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</p>
                        <p style={{ margin: 0, fontSize: '10px', color: g === t ? '#10b981' : g > 0 ? T.warn : T.textMute }}>{g}/{t} active</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Permission detail pane */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                {activeModuleDef && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '22px' }}>{activeModuleDef.icon}</span>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: T.textMain }}>{activeModuleDef.label}</h3>
                          <p style={{ margin: 0, fontSize: '12px', color: T.textMute }}>{activeModuleDef.description}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleAll(activeModule)} style={{
                        padding: '7px 14px', borderRadius: '8px', border: `1px solid ${T.border}`,
                        background: T.cardHi, color: T.textSub, fontWeight: 700,
                        cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                      }}>
                        {activeModuleDef.actions.every(a => perms[activeModule]?.[a.key]) ? '✕ Revoke All' : '✓ Grant All'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {activeModuleDef.actions.map(action => {
                        const on = perms[activeModule]?.[action.key] || false;
                        return (
                          <button key={action.key} onClick={() => togglePerm(activeModule, action.key)} style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '16px 18px', borderRadius: '12px', border: 'none', textAlign: 'left',
                            background: on ? action.dim : 'rgba(255,255,255,0.025)',
                            boxShadow: on ? `0 0 0 1px ${action.color}30` : `0 0 0 1px rgba(255,255,255,0.06)`,
                            cursor: 'pointer', fontFamily: 'inherit', width: '100%',
                            transition: 'all 0.15s',
                          }}>
                            <Checkbox on={on} color={action.color} dim={action.dim} onClick={e => { e.stopPropagation(); togglePerm(activeModule, action.key); }} />
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: on ? action.color : T.textMain }}>
                                {action.label}
                              </p>
                              <p style={{ margin: '2px 0 0', fontSize: '12px', color: T.textMute }}>
                                {actionDescription(activeModule, action.key)}
                              </p>
                            </div>
                            <div style={{
                              width: '48px', height: '24px', borderRadius: '12px',
                              background: on ? action.color : 'rgba(255,255,255,0.07)',
                              boxShadow: on ? `0 2px 8px ${action.color}40` : 'none',
                              position: 'relative', transition: 'all 0.2s', flexShrink: 0,
                            }}>
                              <div style={{
                                position: 'absolute', top: '4px',
                                left: on ? '28px' : '4px',
                                width: '16px', height: '16px', borderRadius: '50%',
                                background: '#fff', transition: 'left 0.2s',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                              }} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 28px', borderTop: `1px solid ${T.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: T.cardHi,
        }}>
          <span style={{ fontSize: '12px', color: T.danger }}>
            {!isValid && step === 'details' && 'Role name is required'}
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} style={{
              padding: '10px 20px', borderRadius: '10px',
              border: `1px solid ${T.border}`, background: 'transparent',
              color: T.textSub, fontWeight: 600, cursor: 'pointer',
              fontSize: '13px', fontFamily: 'inherit',
            }}>Cancel</button>
            {step === 'details' ? (
              <button onClick={() => isValid && setStep('permissions')} disabled={!isValid} style={saveBtnStyle(!isValid, T.accent, false)}>
                Next: Permissions →
              </button>
            ) : (
              <button
                onClick={() => isValid && onSave({ name, description: desc, color, permissions: perms })}
                disabled={!isValid || saving}
                style={saveBtnStyle(!isValid || saving, T.accent, saving)}
              >
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Role'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: T.textSub, marginBottom: '8px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {label} {required && <span style={{ color: T.danger }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = (active) => ({
  width: '100%', padding: '11px 14px', borderRadius: '10px',
  border: `1px solid ${active ? T.accent + '50' : T.border}`,
  background: T.bg, fontSize: '14px', color: T.textMain,
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
});

const saveBtnStyle = (disabled, color, saving) => ({
  padding: '10px 24px', borderRadius: '10px', border: 'none',
  background: disabled ? color + '40' : color,
  color: '#fff', fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '13px', fontFamily: 'inherit',
  boxShadow: !disabled ? `0 4px 16px ${color}40` : 'none',
  transition: 'all 0.2s',
});

function actionDescription(modKey, actionKey) {
  const map = {
    dashboard: { view: 'See analytics, KPIs, and summary cards', export: 'Download dashboard data as CSV/PDF' },
    orders: { view: 'Browse and search all orders', create: 'Place new orders', approve: 'Authorize pending orders', cancel: 'Cancel placed orders' },
    inventory: { view: 'Browse stock levels and items', create: 'Add new inventory items', edit: 'Update item details & pricing', delete: 'Remove items from catalog', adjust: 'Manually adjust stock quantities' },
    clients: { view: 'View client profiles and history', create: 'Add new client accounts', edit: 'Update client information', delete: 'Remove client accounts' },
    logistics: { view: 'See shipments and delivery status', dispatch: 'Assign and dispatch deliveries', track: 'Track active shipments', edit: 'Modify delivery details' },
    reports: { view: 'Access existing reports', generate: 'Create new reports on-demand', export: 'Download reports as files', schedule: 'Set up automated report delivery' },
    users: { view: 'Browse user accounts', create: 'Add new user accounts', edit: 'Modify user details', delete: 'Deactivate or remove users', roles: 'Assign and manage roles & permissions' },
    settings: { view: 'View system configuration', edit: 'Change system settings', integrations: 'Manage third-party integrations & API keys' },
  };
  return map[modKey]?.[actionKey] || '';
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RolesPermissions() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type = 'success') => {
    
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };
 const { can } = useAuth();
  useEffect(() => {
    (async () => {
      try {
        
        const data = await getRolesRequest();
        
        setRoles(data);
        if (data.length > 0) setActiveId(data[0]._id);
      } catch {
        triggerToast('Failed to load roles', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveRole = async (roleData) => {
    setSaving(true);
    try {
      if (editing) {
        const id = editing._id || editing.id;
        const updated = await updateRoleRequest(id, roleData);
        setRoles(prev => prev.map(r => (r._id === id ? updated : r)));
        triggerToast('Role updated successfully');
      } else {
        const created = await createRoleRequest(roleData);
        setRoles(prev => [...prev, created]);
        setActiveId(created._id);
        triggerToast('Role created');
      }
      setModal(false);
      setEditing(null);
    } catch (err) {
      triggerToast(err.response?.data?.msg || 'Error saving role', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const idToDelete = deleteTarget._id || deleteTarget.id;
    if (!idToDelete) return triggerToast('Invalid Role ID', 'error');
    setDeleting(true);
    try {
      await deleteRoleRequest(idToDelete);
      setRoles(prev => {
        const next = prev.filter(r => (r._id || r.id) !== idToDelete);
        if (activeId === idToDelete) setActiveId(next[0]?._id || next[0]?.id || null);
        return next;
      });
      triggerToast(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } catch (err) {
      triggerToast(err.response?.data?.msg || 'Error deleting role', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const activeRole = roles.find(r => r._id === activeId);

  if (loading) return (
    <div style={{
      background: T.bg, height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: '16px',
      fontFamily: '"DM Sans", Inter, system-ui, sans-serif',
    }}>
      <div style={{
        width: '36px', height: '36px', border: `2.5px solid ${T.accent}`,
        borderTopColor: 'transparent', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <p style={{ color: T.textSub, fontWeight: 700, margin: 0, letterSpacing: '0.1em', fontSize: '12px', textTransform: 'uppercase' }}>
        Loading Roles…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );

  return (
    <div style={{
      background: T.bg, minHeight: '100vh',
      fontFamily: '"DM Sans", Inter, system-ui, sans-serif',
      color: T.textMain, display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 10px; }
      `}</style>

      {/* Top Bar */}
      <div style={{
        background: T.card, borderBottom: `1px solid ${T.border}`,
        padding: '0 32px', height: '62px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px',
            background: T.accentGlow, border: `1px solid ${T.borderHi}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px',
          }}>🛡️</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: T.textMain, letterSpacing: '-0.3px' }}>
              Access Control
            </h1>
            <p style={{ margin: 0, fontSize: '11px', color: T.textMute }}>
              {roles.length} role{roles.length !== 1 ? 's' : ''} · {totalPerms} total permissions
            </p>
          </div>
        </div>
        <button
          onClick={() => { setEditing(null); setModal(true); }}
          style={{
            background: T.accent, color: '#fff', border: 'none',
            padding: '9px 18px', borderRadius: '10px', fontWeight: 700,
            cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
            boxShadow: `0 4px 16px rgba(79,142,247,0.35)`,
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: 1 }}>+</span> New Role
        </button>
      </div>

      {/* Main */}
      <div style={{
        display: 'flex', flex: 1, maxWidth: '1280px', width: '100%',
        margin: '0 auto', padding: '28px 24px', gap: '22px', boxSizing: 'border-box',
      }}>
        {/* Sidebar */}
        <div style={{ width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ margin: '0 0 10px 2px', fontSize: '10px', fontWeight: 800, color: T.textMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Configured Roles
          </p>
          {roles.length === 0  && (
            <div style={{
              background: T.card, borderRadius: '14px', padding: '28px 20px',
              textAlign: 'center', border: `1px dashed ${T.border}`,
            }}>
              <p style={{ color: T.textSub, fontSize: '13px', margin: 0 }}>No roles yet.</p>
              <p style={{ color: T.textMute, fontSize: '12px', margin: '4px 0 0' }}>Create your first role above.</p>
            </div>
          )}
          {roles.map(role => {
            const isActive = activeId === role._id;
            const granted = countGranted(role.permissions);
            const pct = Math.round((granted / totalPerms) * 100);
            return (
              <div key={role._id} onClick={() => setActiveId(role._id)} style={{
                background: isActive ? T.cardHi : T.card,
                border: `1.5px solid ${isActive ? role.color + '50' : T.border}`,
                borderRadius: '14px', padding: '14px 16px',
                cursor: 'pointer', transition: 'all 0.18s',
                boxShadow: isActive ? `0 0 0 3px ${role.color}10, 0 8px 24px rgba(0,0,0,0.5)` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: role.color, flexShrink: 0,
                    boxShadow: isActive ? `0 0 10px ${role.color}` : 'none',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: T.textMain, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {role.name}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: T.textMute }}>{granted}/{totalPerms} · {pct}% access</p>
                  </div>
                  {role.isBuiltIn && (
                    <span style={{ fontSize: '9px', background: T.accentGlow, color: T.accent, padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>SYS</span>
                  )}
                </div>

                {/* Progress bar */}
                <div style={{ height: '3px', borderRadius: '2px', background: T.border, marginTop: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: role.color, borderRadius: '2px', transition: 'width 0.3s' }} />
                </div>

                {isActive && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setEditing(role); setModal(true); }}
                      style={{
                        flex: 1, padding: '7px', borderRadius: '8px',
                        border: `1px solid ${T.accent}25`, background: T.accentGlow,
                        color: T.accent, fontWeight: 700, cursor: 'pointer',
                        fontSize: '12px', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                      }}
                    >✏️ Edit</button>
                    <button
                      onClick={e => { e.stopPropagation(); setDeleteTarget(role); }}
                      style={{
                        flex: 1, padding: '7px', borderRadius: '8px',
                        border: `1px solid ${T.danger}25`, background: T.dangerDim,
                        color: T.danger, fontWeight: 700, cursor: 'pointer',
                        fontSize: '12px', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                      }}
                    >🗑️ Delete</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!activeRole ? (
            <div style={{
              background: T.card, borderRadius: '18px', padding: '72px 40px',
              textAlign: 'center', border: `1px dashed ${T.border}`,
            }}>
              <div style={{ fontSize: '44px', marginBottom: '14px' }}>🛡️</div>
              <p style={{ color: T.textSub, fontSize: '15px', margin: 0, fontWeight: 600 }}>Select a role to inspect permissions</p>
              <p style={{ color: T.textMute, fontSize: '13px', margin: '6px 0 0' }}>Or create a new role to get started</p>
            </div>
          ) : (
            <div style={{ background: T.card, borderRadius: '18px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
              {/* Role header */}
              <div style={{
                padding: '22px 28px', borderBottom: `1px solid ${T.border}`,
                background: T.cardHi, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '13px',
                    background: activeRole.color + '18', border: `1.5px solid ${activeRole.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                  }}>🛡️</div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: T.textMain, letterSpacing: '-0.3px' }}>
                      {activeRole.name}
                    </h2>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: T.textSub }}>
                      {activeRole.description || 'No description'}&nbsp;&nbsp;
                      <span style={{ color: activeRole.color, fontWeight: 700 }}>
                        {countGranted(activeRole.permissions)}/{totalPerms} permissions
                      </span>
                    </p>
                  </div>
                </div>
                {/* Overall progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: activeRole.color, lineHeight: 1 }}>
                      {Math.round((countGranted(activeRole.permissions) / totalPerms) * 100)}%
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: T.textMute }}>access level</p>
                  </div>
                </div>
              </div>

              {/* Module rows */}
              {MODULES.map((m, i) => (
                <ModulePermRow
                  key={m.key}
                  module={m}
                  perms={activeRole.permissions}
                  onToggle={() => {}}
                  onToggleAll={() => {}}
                  readOnly={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <RoleModal
          key={editing?._id || 'new'}
          editing={editing}
          saving={saving}
          onClose={() => { setModal(false); setEditing(null); }}
          onSave={saveRole}
        />
      )}
      {deleteTarget && (
        <ConfirmDeleteModal
          role={deleteTarget}
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: '28px', right: '28px',
          background: toast.type === 'error' ? T.danger : '#0d2e20',
          border: `1px solid ${toast.type === 'error' ? T.danger + '50' : '#10b981' + '50'}`,
          color: toast.type === 'error' ? '#fff' : T.success,
          padding: '13px 20px', borderRadius: '12px',
          fontWeight: 700, fontSize: '13px',
          boxShadow: `0 16px 40px rgba(0,0,0,0.5)`,
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px',
          animation: 'slideUp 0.2s ease',
        }}>
          {toast.type === 'error' ? '⚠️' : '✓'} {toast.msg}
        </div>
      )}
    </div>
  );
}