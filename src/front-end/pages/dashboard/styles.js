const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    color: '#f8fafc',
    fontFamily: 'system-ui, sans-serif',
  },
  statsGrid: {
    display: 'grid',
    // This is the magic line for responsiveness:
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#1e293b',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #334155',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  statTitle: {
    color: '#94a3b8',
    fontSize: '14px',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  statIcon: {
    fontSize: '24px',
    backgroundColor: '#334155',
    padding: '8px',
    borderRadius: '8px',
  },
  statChange: {
    fontSize: '12px',
    marginTop: '10px',
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
  // Table responsiveness
  tableWrapper: {
    overflowX: 'auto', // Allows scrolling on small screens
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    minWidth: '600px', // Prevents table from squishing too much
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeader: {
    display: 'flex',
    padding: '12px',
    borderBottom: '1px solid #334155',
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '14px',
  },
  tableRow: {
    display: 'flex',
    padding: '16px 12px',
    borderBottom: '1px solid #334155',
    alignItems: 'center',
    transition: 'background 0.2s',
  },
  tableCell: {
    flex: 1,
    fontSize: '14px',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsive: 1 col on mobile, 2 on desktop
    gap: '20px',
    marginBottom: '30px',
  },
  chartCard: {
    backgroundColor: '#1e293b',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #334155',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#f8fafc',
  },
};

export default styles;