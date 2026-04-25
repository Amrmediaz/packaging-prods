import React, { useState, useEffect, useCallback } from 'react';
import {
  getProductsRequest,
  deleteProductRequest,
} from '../../api/products.api.js';
import { btnStyle, inputStyle } from './styles';
import { AddProductModal } from './components/AddProductModel.jsx';
import { Spinner } from './components/spinner.jsx';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal.jsx';
import { Badge } from './components/Badge.jsx';

const CATEGORIES = ['Packaging', 'Labels', 'Boxes', 'Stickers', 'Custom', 'Other'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getProductsRequest();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      setFetchError(err?.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleAdd = (newProduct) => setProducts(p => [newProduct, ...p]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteProductRequest(deleteTarget._id);
      setProducts(p => p.filter(x => x._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#080e1a', 
      padding: '24px', // Reduced overall padding
      fontFamily: "'DM Sans', sans-serif" 
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .product-row:hover { background: #131e2e !important; }
        .action-btn:hover  { opacity: 0.7; }
        .filter-pill { transition: all 0.2s ease; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
      `}</style>

      <div style={{  margin: '12px', animation: 'fadeIn 0.4s ease' }}>

        {/* ── Header: Tightened margins ── */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <div>
            <p style={{ color: '#eb5224', fontSize: '10px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
              Inventory Management
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', lineHeight: 1 }}>Products</h1>
            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px' }}>
              {loading ? 'Refreshing catalogue...' : `${products.length} Products Available`}
            </p>
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}
            style={{ 
              ...btnStyle('#eb5224'), 
              padding: '10px 20px', 
              fontSize: '13px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
            <span style={{ fontSize: '18px' }}>+</span> Add Product
          </button>
        </header>

        {/* ── Error Notification ── */}
        {fetchError && (
          <div style={{ background: '#2d1a15', border: '1px solid #eb5224', color: '#eb5224', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠ {fetchError}</span>
            <button onClick={fetchProducts} style={{ background: '#eb5224', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        )}

        {/* ── Search & Filters: Compact ── */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
            <input 
              style={{ ...inputStyle, paddingLeft: '40px', height: '42px' }} 
              placeholder="Search products..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', ...CATEGORIES].map(cat => (
              <button 
                key={cat} 
                className="filter-pill" 
                onClick={() => setFilterCat(cat)}
                style={{ 
                  background: filterCat === cat ? '#eb5224' : '#111827', 
                  color: filterCat === cat ? '#fff' : '#94a3b8', 
                  border: `1px solid ${filterCat === cat ? '#eb5224' : '#1f2937'}`, 
                  borderRadius: '8px', padding: '0 16px', height: '42px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' 
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table Container ── */}
        <div style={{ background: '#0f172a', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
          
          {/* Header Row */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr 60px', 
            padding: '12px 20px', 
            background: '#111827',
            borderBottom: '1px solid #1f2937', 
            color: '#475569', 
            fontSize: '11px', 
            fontWeight: '800', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <span>Product Details</span>
            <span>SKU</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span style={{ textAlign: 'right' }}>Action</span>
          </div>

          {loading ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#475569' }}>
              <Spinner />
              <p style={{ marginTop: '12px', fontSize: '13px' }}>Syncing with inventory...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#475569' }}>
              <p style={{ fontSize: '14px', fontWeight: '600' }}>No items found in this view</p>
            </div>
          ) : (
            filtered.map((product, i) => (
              <div 
                key={product._id} 
                className="product-row"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr 60px', 
                  padding: '14px 20px', 
                  borderBottom: i < filtered.length - 1 ? '1px solid #1f2937' : 'none', 
                  alignItems: 'center',
                  animation: `fadeIn 0.3s ease ${i * 0.02}s both`
                }}
              >
                <div>
                  <p style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '14px', margin: 0 }}>{product.name}</p>
                  <p style={{ color: '#475569', fontSize: '11px', margin: '2px 0 0' }}>{product.description || 'No description'}</p>
                </div>
                
                <span style={{ color: '#64748b', fontSize: '12px', fontFamily: 'monospace' }}>{product.sku}</span>
                
                <div><Badge text={product.category} /></div>
                
                <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>
                  {Number(product.price).toFixed(3)} <small style={{ fontSize: '10px', opacity: 0.6 }}>OMR</small>
                </span>
                
                <div style={{ color: Number(product.stock) < 50 ? '#f59e0b' : '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
                  {Number(product.stock).toLocaleString()} <small style={{ fontWeight: '400' }}>{product.unit}</small>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => setDeleteTarget(product)}
                    style={{ 
                      background: 'none', border: 'none', color: '#ef4444', 
                      cursor: 'pointer', fontSize: '16px', padding: '4px' 
                    }}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <p style={{ color: '#334155', fontSize: '11px', fontWeight: '600' }}>
              DISPLAYING {filtered.length} OF {products.length} TOTAL ITEMS
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <AddProductModal 
          onAdd={handleAdd} 
          onClose={() => setShowModal(false)} 
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          product={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}