import { useEffect, useState } from 'react'
import API from '../../utils/api'

const emptyForm = {
  name: '', role: 'Happy Customer', text: '', rating: 5, isActive: true,
}

function AdminTestimonials() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [form, setForm] = useState(emptyForm)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/testimonials?admin=true')
      setList(data.testimonials)
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const openNew = () => {
    setEditId(null)
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview('')
    setShowForm(true)
  }

  const openEdit = async (id) => {
    setEditId(id)
    try {
      const { data } = await API.get(`/testimonials/${id}`)
      const t = data.testimonial
      setForm({
        name: t.name || '',
        role: t.role || 'Happy Customer',
        text: t.text || '',
        rating: t.rating || 5,
        isActive: t.isActive !== undefined ? t.isActive : true,
      })
      if (t.image) {
        setImagePreview(t.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL}${t.image}` : t.image)
      } else {
        setImagePreview('')
      }
      setImageFile(null)
    } catch {
      alert('Failed to load testimonial')
    }
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return alert('Name and text are required')
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (typeof value === 'boolean') fd.append(key, value.toString())
        else if (value !== '' && value !== null && value !== undefined) fd.append(key, value)
      })
      if (imageFile) fd.append('image', imageFile)

      if (editId) {
        await API.put(`/testimonials/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await API.post('/testimonials', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
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
    if (!window.confirm('Delete this testimonial?')) return
    setDeleting(id)
    try {
      await API.delete(`/testimonials/${id}`)
      fetchAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const imgSrc = (img) => {
    if (!img) return '/assets/images/client-img1.jpg'
    if (img.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${img}`
    return img
  }

  const renderStars = (n) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`fa-solid fa-star${i < n ? '' : '-o'}`} style={{ color: i < n ? '#f59e0b' : '#d1d5db', fontSize: 12 }} />
    ))
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-star" /> Testimonials</h1>
        <button className="admin-btn admin-btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-pen" /> {editId ? 'Edit Testimonial' : 'New Testimonial'}
          </div>
          <form onSubmit={handleSave}>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Doe" required />
              </div>
              <div className="admin-form-group">
                <label>Role</label>
                <input name="role" value={form.role} onChange={handleChange} placeholder="e.g. Happy Customer" />
              </div>
              <div className="admin-form-group">
                <label>Rating</label>
                <select name="rating" value={form.rating} onChange={handleChange}>
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
              </div>
              <div className="admin-form-group admin-form-full">
                <label>Testimonial Text *</label>
                <textarea name="text" value={form.text} onChange={handleChange} rows={4} placeholder="What they said..." required />
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
            <i className="fa-solid fa-star" style={{ fontSize: 38, display: 'block', marginBottom: 12, color: 'var(--text-light)' }} />
            <p style={{ marginBottom: 16 }}>No testimonials yet.</p>
            <button className="admin-btn admin-btn-primary" onClick={openNew}>
              <i className="fa-solid fa-plus" /> Add Testimonial
            </button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>Image</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Rating</th>
                  <th>Text</th>
                  <th>Status</th>
                  <th style={{ width: 110 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(t => (
                  <tr key={t._id}>
                    <td><img src={imgSrc(t.image)} alt={t.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: '50%' }} /></td>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}>{t.role || '—'}</td>
                    <td>{renderStars(t.rating)}</td>
                    <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {t.text}
                    </td>
                    <td>
                      <span className={`status-badge ${t.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        {t.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="admin-btn admin-btn-outline admin-btn-xs" onClick={() => openEdit(t._id)} title="Edit">
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button className="admin-btn admin-btn-danger admin-btn-xs" onClick={() => handleDelete(t._id)} disabled={deleting === t._id} title="Delete">
                          <i className={`fa-solid ${deleting === t._id ? 'fa-spinner fa-spin' : 'fa-trash'}`} />
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

export default AdminTestimonials
