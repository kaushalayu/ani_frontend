import { useEffect, useState, useCallback } from 'react'
import API from '../../utils/api'
import ProductModal from './ProductModal'

function AdminProducts() {
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [filterBadge, setFilterBadge] = useState('')
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]           = useState(0)
  const [deleting, setDeleting]     = useState(null)

  // Modal state
  const [modalOpen, setModalOpen]   = useState(false)
  const [editId, setEditId]         = useState(null)   // null = new product

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12 })
      if (search)      params.append('search', search)
      if (filterBadge) params.append('badge', filterBadge)
      const { data } = await API.get(`/products?${params}`)
      setProducts(data.products)
      setTotalPages(data.pages)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, filterBadge])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    setDeleting(id)
    try {
      await API.delete(`/products/${id}`)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const openAdd  = () => { setEditId(null); setModalOpen(true) }
  const openEdit = (id) => { setEditId(id); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditId(null) }
  const onSaved  = () => { closeModal(); fetchProducts() }

  const BADGE_FILTERS = [
    { value: '',            label: 'All Products' },
    { value: 'sleep',       label: '😴 Sleeping Pills' },
    { value: 'painkillers', label: '💊 Painkillers' },
    { value: 'calm',        label: '🧘 Anxiety' },
    { value: 'vitamin',     label: '🌿 Vitamins' },
    { value: 'herbal',      label: '🌱 Herbal' },
  ]

  const imgSrc = (img) => {
    if (!img) return '/assets/images/best-product1.png'
    if (img.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${img}`
    return img
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-capsules" /> Products
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-light)', marginLeft: 8 }}>
            ({total} total)
          </span>
        </h1>
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>
          <i className="fa-solid fa-plus" /> Add Product
        </button>
      </div>

      {/* ── Quick-filter badge pills ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {BADGE_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => { setFilterBadge(f.value); setPage(1) }}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '1.5px solid',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderColor: filterBadge === f.value ? 'var(--primary)' : 'var(--border)',
              background:  filterBadge === f.value ? 'var(--primary)' : 'var(--card-bg)',
              color:       filterBadge === f.value ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="admin-table-card">
        {/* ── Search bar ── */}
        <div className="admin-search-bar">
          <i className="fa-solid fa-search" style={{ color: 'var(--text-light)' }} />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loader" />
            <div>Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-box-open" style={{ fontSize: 38, display: 'block', marginBottom: 12, color: 'var(--text-light)' }} />
            <p style={{ marginBottom: 16 }}>{search || filterBadge ? 'No products match your filters.' : 'No products yet — add your first one!'}</p>
            <button className="admin-btn admin-btn-primary" onClick={openAdd}>
              <i className="fa-solid fa-plus" /> Add Product
            </button>
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 56 }}>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Badge</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Flags</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img src={imgSrc(p.image)} alt={p.name} className="admin-product-img" />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                      {p.sku && <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>SKU: {p.sku}</div>}
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      {p.category?.name || '—'}
                    </td>
                    <td>
                      {p.badge
                        ? <span style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>{p.badge}</span>
                        : <span style={{ color: 'var(--text-light)', fontSize: 12 }}>—</span>
                      }
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {p.hasPillsOptions && p.pillsOptions?.length > 0
                        ? `$${Number(p.pillsOptions[0].price).toFixed(2)}+`
                        : `$${Number(p.price || 0).toFixed(2)}`}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {p.hasPillsOptions
                        ? p.pillsOptions?.reduce((a, b) => a + Number(b.stock || 0), 0)
                        : p.stock || 0}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.isFeatured   && <span className="prod-flag feat">⭐</span>}
                        {p.isNewArrival && <span className="prod-flag new">🆕</span>}
                        {p.isBestSeller && <span className="prod-flag best">🔥</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${p.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        <i className={`fa-solid ${p.isActive ? 'fa-eye' : 'fa-eye-slash'}`} />
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button
                          className="admin-btn admin-btn-outline admin-btn-xs"
                          onClick={() => openEdit(p._id)}
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-xs"
                          onClick={() => handleDelete(p._id)}
                          disabled={deleting === p._id}
                          title="Delete"
                        >
                          <i className={`fa-solid ${deleting === p._id ? 'fa-spinner fa-spin' : 'fa-trash'}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="admin-pagination">
                <span style={{ fontSize: 12, color: 'var(--text-light)' }}>Page {page} of {totalPages}</span>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  <i className="fa-solid fa-chevron-left" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={page === i + 1 ? 'active' : ''}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Product Modal ── */}
      {modalOpen && (
        <ProductModal
          productId={editId}
          onClose={closeModal}
          onSaved={onSaved}
        />
      )}
    </div>
  )
}

export default AdminProducts
