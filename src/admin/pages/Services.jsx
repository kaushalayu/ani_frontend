import { useEffect, useState } from 'react'
import API from '../../utils/api'

const emptyForm = {
  title: '', description: '', icon: 'fa-solid fa-star', order: 0, isActive: true,
}

function AdminServices() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/services?admin=true')
      setList(data.services)
    } catch {
      // Silently handle
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const openNew = () => {
    setEditId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = async (id) => {
    setEditId(id)
    try {
      const { data } = await API.get(`/services/${id}`)
      const s = data.service
      setForm({
        title: s.title || '',
        description: s.description || '',
        icon: s.icon || 'fa-solid fa-star',
        order: s.order || 0,
        isActive: s.isActive !== undefined ? s.isActive : true,
      })
    } catch {
      alert('Failed to load service')
    }
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) return alert('Title and description are required')
    setSaving(true)
    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
      }

      if (editId) {
        await API.put(`/services/${editId}`, payload)
      } else {
        await API.post('/services', payload)
      }
      setShowForm(false)
      fetchAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return
    setDeleting(id)
    try {
      await API.delete(`/services/${id}`)
      fetchAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-hand-holding-heart" /> Services</h1>
        <button className="admin-btn admin-btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-pen" /> {editId ? 'Edit Service' : 'New Service'}
          </div>
          <form onSubmit={handleSave}>
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-full">
                <label>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Prescription Medicines" required />
              </div>
              <div className="admin-form-group admin-form-full">
                <label>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the service..." required />
              </div>
              <div className="admin-form-group">
                <label>Icon (Font Awesome class)</label>
                <input name="icon" value={form.icon} onChange={handleChange} placeholder="fa-solid fa-prescription-bottle-medical" />
                <div style={{ marginTop: 8, fontSize: 24, color: 'var(--primary)' }}>
                  <i className={form.icon} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Order</label>
                <input name="order" type="number" value={form.order} onChange={handleChange} placeholder="0" />
              </div>
              <div className="admin-form-group">
                <label className="admin-flag-label" style={{ border: 'none', padding: 0 }}>
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                  <i className="fa-solid fa-eye" style={{ color: 'var(--primary)' }} /> Active (visible on site)
                </label>
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-card">
        {loading ? (
          <div className="admin-loading"><div className="admin-loader" /><div>Loading...</div></div>
        ) : list.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-hand-holding-heart" style={{ fontSize: 38, display: 'block', marginBottom: 12, color: 'var(--text-light)' }} />
            <p style={{ marginBottom: 16 }}>No services yet.</p>
            <button className="admin-btn admin-btn-primary" onClick={openNew}>
              <i className="fa-solid fa-plus" /> Add Service
            </button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th style={{ width: 110 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s, i) => (
                  <tr key={s._id}>
                    <td style={{ color: 'var(--text-light)' }}>{i + 1}</td>
                    <td><i className={s.icon} style={{ fontSize: 20, color: 'var(--primary)' }} /></td>
                    <td style={{ fontWeight: 600 }}>{s.title}</td>
                    <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {s.description}
                    </td>
                    <td>{s.order}</td>
                    <td>
                      <span className={`status-badge ${s.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        {s.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="admin-btn admin-btn-outline admin-btn-xs" onClick={() => openEdit(s._id)} title="Edit">
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button className="admin-btn admin-btn-danger admin-btn-xs" onClick={() => handleDelete(s._id)} disabled={deleting === s._id} title="Delete">
                          <i className={`fa-solid ${deleting === s._id ? 'fa-spinner fa-spin' : 'fa-trash'}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminServices
