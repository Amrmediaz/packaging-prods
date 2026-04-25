import React from 'react';
import { TComponent} from '../styles.js'; 


 const RoleCard = ({ role, active, onClick, onDelete }) => (
  <div 
    onClick={onClick}
    style={{
      padding: '16px', borderRadius: '12px', border: '1px solid', cursor: 'pointer',
      marginBottom: '10px', transition: '0.2s',
      backgroundColor: active ? T.cardHi : 'transparent',
      borderColor: active ? T.accent : T.border,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: T.textMain, fontWeight: '600' }}>{role.name}</span>
      {active && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          🗑️
        </button>
      )}
    </div>
    <div style={{ color: T.textSub, fontSize: '12px', marginTop: '4px' }}>
      {role.description || 'Access Level'}
    </div>
  </div>
);

export default RoleCard;