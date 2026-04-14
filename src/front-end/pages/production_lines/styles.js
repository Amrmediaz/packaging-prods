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

export default styles;