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
          + Add Product
        </Link>
      </div>

      <div className="admin-table-card">
        <div className="admin-search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        {loading ? (
          <div className="admin-loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="admin-empty">No products found.</div>
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
                        src={p.image.startsWith('/uploads') ? `http://localhost:5000${p.image}` : p.image}
                        alt={p.name}
                        className="admin-product-img"
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{p.badge}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{p.category?.name || '—'}</td>
                    <td style={{ fontWeight: 600 }}>
                      {p.hasPillsOptions && p.pillsOptions?.length > 0
                        ? `$${p.pillsOptions[0].price.toFixed(2)}+`
                        : `$${p.price?.toFixed(2)}`}
                    </td>
                    <td>
                      {p.hasPillsOptions
                        ? p.pillsOptions?.reduce((a, b) => a + b.stock, 0)
                        : p.stock}
                    </td>
                    <td>
                      <span className={`status-badge ${p.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link to={`/admin/products/edit/${p._id}`} className="admin-btn admin-btn-outline admin-btn-sm">
                          Edit
                        </Link>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(p._id)}
                          disabled={deleting === p._id}
                        >
                          {deleting === p._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={page === i + 1 ? 'active' : ''}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
