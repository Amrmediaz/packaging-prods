
import { useState } from 'react';
import {

  createProductRequest,

} from '../../../api/products.api';

import { btnStyle , inputStyle  } from '../styles';
import { Spinner } from './spinner.jsx';
const CATEGORIES = ['Packaging', 'Labels', 'Boxes', 'Stickers', 'Custom', 'Other'];

const UNITS      = ['pcs', 'rolls', 'sheets', 'kg', 'meters'];

const EMPTY_PRODUCT = { name: '', sku: '', category: 'Packaging', unit: 'pcs', price: '', stock: '', description: '' };
const Field = ({ label, required, children, hint, error }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {label} {required && <span style={{ color: '#eb5224' }}>*</span>}
    </label>
    {children}
    {hint && !error && <span style={{ color: '#475569', fontSize: '11px' }}>{hint}</span>}
    {error && <span style={{ color: '#eb5224', fontSize: '11px', fontWeight: '700' }}>⚠ {error}</span>}
  </div>
);
export function AddProductModal({ onAdd, onClose }) {
  const [form, setForm]     = useState(EMPTY_PRODUCT);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone]     = useState(false);

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.sku.trim())  e.sku  = 'SKU is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = 'Enter a valid price';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = 'Enter a valid stock quantity';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      setSaving(true);
      const data = await createProductRequest({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      onAdd(data.product);
      setDone(true);
      setTimeout(() => onClose(), 1400);
    } catch (err) {
      console.error(err);
      setErrors({ _global: err?.response?.data?.message || 'Something went wrong. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#0f172a', border: '1px solid #1f2937', borderRadius: '20px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.25s ease' }}>
        {done ? (
          <div style={{ padding: '80px', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: '#10b981', margin: 0, fontWeight: '900' }}>Product Added!</h2>
            <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: '14px' }}>Refreshing the list…</p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: '900' }}>
                  New <span style={{ color: '#eb5224' }}>Product</span>
                </h2>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>Fill in the product details below</p>
              </div>
              <button onClick={onClose} style={{ background: '#1e293b', border: 'none', color: '#94a3b8', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Global error */}
              {errors._global && (
                <div style={{ background: '#2d1a15', border: '1px solid #eb5224', color: '#eb5224', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>
                  ⚠ {errors._global}
                </div>
              )}

              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Product Name" required error={errors.name}>
                  <input style={{ ...inputStyle, borderColor: errors.name ? '#eb5224' : '#374151' }}
                    placeholder="e.g. Custom Printed Boxes" value={form.name} onChange={set('name')} />
                </Field>
                <Field label="SKU" required error={errors.sku}>
                  <input style={{ ...inputStyle, borderColor: errors.sku ? '#eb5224' : '#374151' }}
                    placeholder="e.g. PKG-001" value={form.sku} onChange={set('sku')} />
                </Field>
              </div>

              {/* Row 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Category">
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={set('category')}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Unit">
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.unit} onChange={set('unit')}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </Field>
              </div>

              {/* Row 3 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Unit Price (OMR)" required error={errors.price}>
                  <input style={{ ...inputStyle, borderColor: errors.price ? '#eb5224' : '#374151' }}
                    type="number" min="0" step="0.01" placeholder="0.000" value={form.price} onChange={set('price')} />
                </Field>
                <Field label="Stock Quantity" required error={errors.stock}>
                  <input style={{ ...inputStyle, borderColor: errors.stock ? '#eb5224' : '#374151' }}
                    type="number" min="0" placeholder="e.g. 5000" value={form.stock} onChange={set('stock')} />
                </Field>
              </div>

              {/* Description */}
              <Field label="Description" hint="Optional — brief product notes or specs">
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                  placeholder="Brief description of the product…" value={form.description} onChange={set('description')} />
              </Field>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px', borderTop: '1px solid #1f2937' }}>
                <button onClick={onClose} style={btnStyle('#1e293b')}>Cancel</button>
                <button onClick={handleSubmit} disabled={saving}
                  style={btnStyle('#eb5224', { opacity: saving ? 0.6 : 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' })}>
                  {saving ? <><Spinner /> Saving…</> : '+ Add Product'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}