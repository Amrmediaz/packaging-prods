import styles from '../styles.js'; // Adjust path if needed

const STATUS_THEMES = {
  shipped: { bg: '#0c4a6e', color: '#7dd3fc' },
  pending: { bg: '#451a03', color: '#fdba74' },
  delivered: { bg: '#064e3b', color: '#6ee7b7' },
  processing: { bg: '#1e1b4b', color: '#a5b4fc' },
};
const ActivityRow = ({ item }) => (
  <div style={styles.tableRow}>
    <div style={{...styles.tableCell, flex: 0.5}}>{item.id}</div>
    <div style={styles.tableCell}><strong>{item.client}</strong></div>
    <div style={styles.tableCell}>{item.action}</div>
    <div style={styles.tableCell}>{item.time}</div>
    <div style={styles.tableCell}>
      <span style={{
        ...styles.badge,
        backgroundColor: STATUS_THEMES[item.status].bg,
        color: STATUS_THEMES[item.status].color,
      }}>
        {item.status}
      </span>
    </div>
  </div>
);

export default ActivityRow;