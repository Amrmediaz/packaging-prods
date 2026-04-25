
import {   CATEGORY_COLORS} from '../styles';

export const Badge = ({ text }) => (
  <span style={{
    background: `${CATEGORY_COLORS[text] || '#64748b'}22`,
    color: CATEGORY_COLORS[text] || '#64748b',
    border: `1px solid ${CATEGORY_COLORS[text] || '#64748b'}55`,
    borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.04em',
  }}>
    {text}
  </span>
);

