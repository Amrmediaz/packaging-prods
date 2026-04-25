
import { btnStyle  } from '../styles';
import { Spinner } from './spinner.jsx';

export function ConfirmDeleteModal({ product, onConfirm, onClose, deleting }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#0f172a', border: '1px solid #3d2218', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '32px 28px', animation: 'slideUp 0.2s ease', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🗑️</div>
        <h3 style={{ color: '#fff', margin: '0 0 8px', fontWeight: '900', fontSize: '18px' }}>Delete Product?</h3>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>
          <span style={{ color: '#f1f5f9', fontWeight: '700' }}>{product.name}</span> will be permanently removed from the catalogue.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={onClose} style={btnStyle('#1e293b', { minWidth: '100px' })}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting}
            style={btnStyle('#eb5224', { minWidth: '120px', opacity: deleting ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' })}>
            {deleting ? <><Spinner /> Deleting…</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}