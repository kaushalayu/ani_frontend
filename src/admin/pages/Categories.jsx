import { useEffect, useState } from 'react'
import API from '../../utils/api'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/categories')
      setCategories(data.categories)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editId) {
        await API.put(`/categories/${editId}`, form)
      } else {
        await API.post('/categories', form)
      }
      setForm({ name: '', description: '' })
      setEditId(null)
      fetchCategories()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (cat) => {
    setEditId(cat._id)
    setForm({ name: cat.name, description: cat.description || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await API.delete(`/categories/${id}`)
      fetchCategories()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleCancel = () => {
    setEditId(null)
    setForm({ name: '', description: '' })
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Categories</h1>
      </div>

      {/* Form */}
      <div className="admin-form-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
          {editId ? 'Edit Category' : 'Add New Category'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <div className="admin-form-group">
              <label>Category Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Vitamins & Supplements"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Optional description"
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editId ? 'Update Category' : 'Add Category'}
            </button>
            {editId && (
              <button type="button" className="admin-btn admin-btn-outline" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2>All Categories ({categories.length})</h2>
        </div>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="admin-empty">No categories yet. Add one above!</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td style={{ fontWeight: 600 }}>{cat.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{cat.slug}</td>
                  <td style={{ fontSize: 13, color: '#6b7280' }}>{cat.description || '—'}</td>
                  <td>
                    <span className={`status-badge ${cat.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => handleEdit(cat)}>Edit</button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(cat._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminCategories
