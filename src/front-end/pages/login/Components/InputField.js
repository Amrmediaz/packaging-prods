import styles from '../styles.js'; // Adjust path if needed

const InputField = ({ label, name, type, value, onChange, disabled, placeholder }) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <input
      name={name}
      type={type}
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required
    />
  </div>
);

export default InputField;