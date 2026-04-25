import React from 'react';
import { T  } from '../styles.js';
import { ACTIONS } from '../Roles.utils.js';

 const ModulePermRow = ({ module, perms, onToggle, readOnly }) => (
  <div style={{ display: 'flex', padding: '16px', borderBottom: `1px solid ${T.border}` }}>
    <div style={{ flex: 1, color: T.textMain }}>
      {module.icon} {module.label}
    </div>
    <div style={{ display: 'flex', gap: '8px' }}>
      {ACTIONS.map(action => (
        <button
          key={action}
          disabled={readOnly}
          onClick={() => onToggle(module.key, action)}
          style={{
            padding: '6px 12px', borderRadius: '6px', fontSize: '11px', border: '1px solid',
            background: perms[module.key]?.[action] ? T.accentDim : 'transparent',
            color: perms[module.key]?.[action] ? T.accent : T.textMute,
            borderColor: perms[module.key]?.[action] ? T.accent : T.border,
            cursor: readOnly ? 'default' : 'pointer'
          }}
        >
          {action.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);

export default ModulePermRow;