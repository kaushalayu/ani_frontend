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
        <h1><i className="fa-solid fa-tags" style={{ marginRight: 10, color: 'var(--primary)' }} />Categories</h1>
      </div>

      <div className="admin-form-card" style={{ marginBottom: 24 }}>
        <div className="admin-section-title">
          <i className={`fa-solid ${editId ? 'fa-pen' : 'fa-plus'}`} />
          {editId ? 'Edit Category' : 'Add New Category'}
        </div>
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
              <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
              {saving ? 'Saving...' : editId ? 'Update Category' : 'Add Category'}
            </button>
            {editId && (
              <button type="button" className="admin-btn admin-btn-outline" onClick={handleCancel}>
                <i className="fa-solid fa-xmark" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2>All Categories ({categories.length})</h2>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loader" />
          </div>
        ) : categories.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-tag" style={{ fontSize: 32, display: 'block', marginBottom: 8, color: 'var(--text-light)' }} />
            No categories yet. Add one above!
          </div>
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
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{cat.slug}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cat.description || '—'}</td>
                  <td>
                    <span className={`status-badge ${cat.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                      <i className={`fa-solid ${cat.isActive ? 'fa-eye' : 'fa-eye-slash'}`} style={{ marginRight: 4 }} />
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="admin-btn admin-btn-outline admin-btn-xs" onClick={() => handleEdit(cat)}>
                        <i className="fa-solid fa-pen" /> Edit
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-xs" onClick={() => handleDelete(cat._id)}>
                        <i className="fa-solid fa-trash" /> Delete
                      </button>
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
