import React, { useState } from 'react';
import {  
   MODULES , mkPerms, countGranted, getModuleGranted , totalPerms  , actionDescription

 } from '../Roles.utils.js';
 import {T , ROLE_COLORS , saveBtnStyle , inputStyle} from '../styles.js'

export default function RoleModal({ onClose, onSave, editing, saving }) {
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