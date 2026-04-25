const styles = {
  // Layout
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  pageTitle: { fontSize: '22px', fontWeight: '600', color: '#f8fafc' },
  pageSubtitle: { fontSize: '13px', color: '#94a3b8', marginTop: '4px' },

  // Role cards row
  rolesRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '30px',
  },
  roleCard: (active, color) => ({
    backgroundColor: '#1e293b',
    border: `1px solid ${active ? color : '#334155'}`,
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    position: 'relative',
    outline: active ? `1px solid ${color}` : 'none',
  }),
  roleDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
    display: 'inline-block',
    marginRight: '8px',
  }),
  roleName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px',
  },
  roleDesc: { fontSize: '12px', color: '#94a3b8' },
  roleActions: {
    display: 'flex',
    gap: '6px',
    marginTop: '12px',
  },
  iconBtn: {
    background: '#334155',
    border: 'none',
    borderRadius: '6px',
    color: '#94a3b8',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // Permissions table
  permTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '10px 14px',
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'left',
    borderBottom: '1px solid #334155',
    backgroundColor: '#0f172a',
  },
  thCenter: {
    padding: '10px 14px',
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center',
    borderBottom: '1px solid #334155',
    backgroundColor: '#0f172a',
  },
  td: {
    padding: '12px 14px',
    fontSize: '14px',
    borderBottom: '1px solid #334155',
    color: '#f8fafc',
  },
  tdCenter: {
    padding: '12px 14px',
    fontSize: '14px',
    borderBottom: '1px solid #334155',
    textAlign: 'center',
  },

  // Toggle
  toggle: (on, disabled) => ({
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: `1px solid ${on ? '#3b82f6' : '#334155'}`,
    backgroundColor: on ? '#1d4ed8' : '#1e293b',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: on ? '#bfdbfe' : '#475569',
    transition: 'background 0.15s, border-color 0.15s',
    opacity: disabled ? 0.5 : 1,
  }),

  // Buttons
  btnPrimary: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    backgroundColor: '#334155',
    color: '#f8fafc',
    border: '1px solid #475569',
    borderRadius: '8px',
    padding: '10px 18px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  btnDanger: {
    backgroundColor: '#7f1d1d',
    color: '#fca5a5',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // Modal overlay
  overlay: {
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '28px',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '85vh',
    overflowY: 'auto',
  },
  modalTitle: { fontSize: '18px', fontWeight: '600', color: '#f8fafc', marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' },
  input: {
    width: '100%',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#f8fafc',
    fontSize: '14px',
    marginBottom: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  colorRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  colorSwatch: (c, active) => ({
    width: '28px', height: '28px', borderRadius: '50%',
    backgroundColor: c, cursor: 'pointer',
    outline: active ? `3px solid #fff` : 'none',
    outlineOffset: '2px',
  }),

  // Toast
  toast: {
    position: 'fixed', bottom: '24px', right: '24px',
    backgroundColor: '#064e3b', color: '#6ee7b7',
    border: '1px solid #065f46',
    borderRadius: '8px', padding: '12px 20px',
    fontSize: '14px', zIndex: 2000,
  },
};
 const TComponent = {
  bg: '#0f172a',
  card: '#0f172a',
  cardHi: '#1e293b',
  accent: '#3b82f6',
  accentDim: 'rgba(59,130,246,0.12)',
  danger: '#f43f5e',
  success: '#10b981',
  textMain: '#f8fafc',
  textSub: '#94a3b8',
  textMute: '#475569',
  border: 'rgba(255,255,255,0.06)',
};

 const commonStyles = {
  flexCenter: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalOverlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(2,6,23,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    backdropFilter: 'blur(4px)'
  }
};
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

export { styles, TComponent, commonStyles , T , ROLE_COLORS  , saveBtnStyle , inputStyle};