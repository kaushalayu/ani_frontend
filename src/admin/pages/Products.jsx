import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/api'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleting, setDeleting] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10 })
      if (search) params.append('search', search)
      const { data } = await API.get(`/products?${params}`)
      setProducts(data.products)
      setTotalPages(data.pages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, search])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
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

  return (
    <div>
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          <i className="fa-solid fa-plus" /> Add Product
        </Link>
      </div>

      <div className="admin-table-card">
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
            <i className="fa-solid fa-box-open" style={{ fontSize: 32, display: 'block', marginBottom: 8, color: 'var(--text-light)' }} />
            {search ? 'No products match your search.' : 'No products found. Add your first product!'}
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={p.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL}${p.image}` : p.image}
                        alt={p.name}
                        className="admin-product-img"
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      {p.badge && <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>{p.badge}</div>}
                    </td>
                    <td style={{ fontSize: 13 }}>{p.category?.name || '—'}</td>
                    <td style={{ fontWeight: 700 }}>
                      {p.hasPillsOptions && p.pillsOptions?.length > 0
                        ? `$${p.pillsOptions[0].price.toFixed(2)}+`
                        : `$${p.price?.toFixed(2)}`}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        color: p.isActive ? 'var(--success)' : 'var(--text-light)',
                        fontWeight: 600
                      }}>
                        <i className={`fa-solid ${p.isActive ? 'fa-circle' : 'fa-circle'}`} style={{ fontSize: 8 }} />
                        {p.hasPillsOptions
                          ? p.pillsOptions?.reduce((a, b) => a + b.stock, 0)
                          : p.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${p.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        <i className={`fa-solid ${p.isActive ? 'fa-eye' : 'fa-eye-slash'}`} />
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link to={`/admin/products/edit/${p._id}`} className="admin-btn admin-btn-outline admin-btn-xs">
                          <i className="fa-solid fa-pen" /> Edit
                        </Link>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-xs"
                          onClick={() => handleDelete(p._id)}
                          disabled={deleting === p._id}
                        >
                          <i className={`fa-solid ${deleting === p._id ? 'fa-spinner fa-spin' : 'fa-trash'}`} />
                          {deleting === p._id ? '' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="admin-pagination">
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
    </div>
  )
}

export default AdminProducts
