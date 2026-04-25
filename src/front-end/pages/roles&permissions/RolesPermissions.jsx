

import React, { useState, useEffect } from 'react';
import RoleModal  from './Components/RoleModal.js';
import {
  getRolesRequest,
  createRoleRequest,
  updateRoleRequest,
  deleteRoleRequest,
} from '../../api/role.ap';
import {  
   MODULES , countGranted , totalPerms  

 } from './Roles.utils';
 import { ConfirmDeleteModal } from '../roles&permissions/Components/ConfirmDeleteModal.js';

 import {T } from './styles.js'

 import ModulePermRow from './Components/ModulePermRow.js';


// ─── Toggle checkbox ──────────────────────────────────────────────────────────











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
        setTimeout(() => window.location.reload(), 10);

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
      <div 
      style={{
        display: 'flex', flex: 1, maxWidth: '1280px', width: '100%',
        margin: '0 auto', padding: '28px 12px', gap: '22px', boxSizing: 'border-box',
      }}
      >
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

                {isActive && !role.isBuiltIn && (
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