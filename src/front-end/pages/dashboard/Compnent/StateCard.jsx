import styles from '../styles.js'; // Adjust path if needed

const StatCard = ({ title, value, icon, change, up }) => (
  <div style={styles.statCard}>
    <div style={styles.statTop}>
      <div>
        <div style={styles.statTitle}>{title}</div>
        <div style={styles.statValue}>{value}</div>
      </div>
      <div style={styles.statIcon}>{icon}</div>
    </div>
    <div style={{ ...styles.statChange, color: up ? '#4ade80' : '#f87171' }}>
      {change}
    </div>
  </div>
);

export default StatCard;