// src/pages/ProductionLines/styles.js
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    color: '#f8fafc',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#1e293b',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #334155',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  statTitle: {
    fontSize: '12px',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #334155',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    minWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeader: {
    display: 'flex',
    padding: '12px',
    borderBottom: '1px solid #334155',
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  tableRow: {
    display: 'flex',
    padding: '16px 12px',
    borderBottom: '1px solid #1e293b',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: '14px',
  },
};

// Added export to this function
export const btnStyle = (bg, extra = {}) => ({
  background: bg,
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'opacity 0.2s, transform 0.1s',
  '&:hover': { opacity: 0.9 }, // Added hover hint
  ...extra,
});

// Added export to this object
export const inputStyle = {
  background: '#1f2937',
  border: '1px solid #374151',
  borderRadius: '8px',
  color: '#fff',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};
export const CATEGORY_COLORS = {
  Packaging: '#0ea5e9', Labels: '#8b5cf6', Boxes: '#eb5224',
  Stickers: '#10b981', Custom: '#f59e0b', Other: '#64748b',
};

export default styles;