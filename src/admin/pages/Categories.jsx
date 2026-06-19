import { useEffect, useState } from 'react'
import API from '../../utils/api'

// Badge hint — admin ko dikhao kaunsi category kaunse badge se products filter karti hai
const BADGE_HINTS = {
  'sleeping pills': { badge: 'sleep aid', color: '#6366f1', icon: '😴' },
  'painkillers':    { badge: 'painkillers', color: '#0f766e', icon: '💊' },
  'anxiety pills':  { badge: 'calm', color: '#7c3aed', icon: '🧘' },
}

const getBadgeHint = (name = '') => {
  const key = name.toLowerCase().trim()
  for (const [k, v] of Object.entries(BADGE_HINTS)) {
    if (key.includes(k.split(' ')[0])) return v
  }
  return null
}

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

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
        showToast('Category updated!')
      } else {
        await API.post('/categories', form)
        showToast('Category created!')
      }
      setForm({ name: '', description: '' })
      setEditId(null)
      fetchCategories()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save', 'error')
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
    if (!window.confirm('Delete this category? Products in this category may be affected.')) return
    try {
      await API.delete(`/categories/${id}`)
      showToast('Category deleted')
      fetchCategories()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error')
    }
  }

  const handleCancel = () => {
    setEditId(null)
    setForm({ name: '', description: '' })
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>
          <i className="fa-solid fa-tags" />
          Categories
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-light)', marginLeft: 8 }}>
            ({categories.length})
          </span>
        </h1>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}`} />
          {toast.msg}
        </div>
      )}

      {/* Info box about badge system */}
      <div className="badge-mapping-wrap" style={{
        background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12,
        padding: '14px 18px', marginBottom: 22,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <i className="fa-solid fa-circle-info" style={{ color: '#f59e0b', fontSize: 18, marginTop: 2, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ fontSize: 13, color: '#92400e' }}>Product → Category Badge Mapping:</strong>
          <p style={{ fontSize: 12.5, color: '#78350f', margin: '4px 0 0' }}>
            Products appear in Navbar submenus based on their <strong>Badge</strong> field, not category name.
            When adding a product, set the badge accordingly:
          </p>
          <div className="badge-mapping-items" style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            {Object.entries(BADGE_HINTS).map(([cat, hint]) => (
              <span key={cat} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 12px', borderRadius: 20,
                background: hint.color + '18', border: `1px solid ${hint.color}44`,
                fontSize: 12, fontWeight: 600, color: hint.color,
              }}>
                {hint.icon} {cat.charAt(0).toUpperCase() + cat.slice(1)} → badge: <code style={{ fontFamily: 'monospace' }}>{hint.badge}</code>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit form */}
      <div className="admin-form-card" style={{ marginBottom: 24 }}>
        <div className="admin-section-title">
          <i className={`fa-solid ${editId ? 'fa-pen' : 'fa-plus'}`} />
          {editId ? 'Edit Category' : 'Add New Category'}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Category Name <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Sleeping Pills"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Description <span style={{ fontSize: 11, color: 'var(--text-light)' }}>(optional)</span></label>
              <input
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description of this category"
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

      {/* Categories table */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2><i className="fa-solid fa-list" /> All Categories ({categories.length})</h2>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loader" />
            <div>Loading categories...</div>
          </div>
        ) : categories.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-tag" style={{ fontSize: 36, display: 'block', marginBottom: 12 }} />
            <p>No categories yet.</p>
            <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>
              Start the backend server — it will auto-create Sleeping Pills, Painkillers &amp; Anxiety Pills.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Navbar Badge</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const hint = getBadgeHint(cat.name)
                  return (
                    <tr key={cat._id}>
                      <td style={{ fontWeight: 600, fontSize: 13.5 }}>{cat.name}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
                        {cat.slug}
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 200 }}>
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {cat.description || '—'}
                        </span>
                      </td>
                      <td>
                        {hint ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '3px 10px', borderRadius: 20,
                            background: hint.color + '18',
                            border: `1px solid ${hint.color}44`,
                            fontSize: 11.5, fontWeight: 700, color: hint.color,
                            fontFamily: 'monospace',
                          }}>
                            {hint.icon} {hint.badge}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-light)', fontSize: 12 }}>—</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${cat.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                          <i className={`fa-solid ${cat.isActive ? 'fa-eye' : 'fa-eye-slash'}`} />
                          {cat.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="admin-btn admin-btn-outline admin-btn-xs" onClick={() => handleEdit(cat)}>
                            <i className="fa-solid fa-pen" /> Edit
                          </button>
                          <button className="admin-btn admin-btn-danger admin-btn-xs" onClick={() => handleDelete(cat._id)}>
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCategories
