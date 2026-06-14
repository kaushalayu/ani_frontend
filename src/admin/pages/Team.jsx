import { useEffect, useState } from 'react'
import API from '../../utils/api'

const emptyForm = {
  name: '', role: '', bio: '', image: '', order: 0, isActive: true,
  socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '' },
}

function AdminTeam() {
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
      const { data } = await API.get('/team?admin=true')
      setList(data.members)
    } catch {
      // Silently handle
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('social.')) {
      const key = name.split('.')[1]
      setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, [key]: value } }))
    } else {
      setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    }
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
      const { data } = await API.get(`/team/${id}`)
      const m = data.member
      setForm({
        name: m.name || '',
        role: m.role || '',
        bio: m.bio || '',
        order: m.order || 0,
        isActive: m.isActive !== undefined ? m.isActive : true,
        socialLinks: m.socialLinks || { facebook: '', instagram: '', linkedin: '', twitter: '' },
      })
      if (m.image) {
        setImagePreview(m.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL}${m.image}` : m.image)
      } else {
        setImagePreview('')
      }
      setImageFile(null)
    } catch {
      alert('Failed to load team member')
    }
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.role.trim()) return alert('Name and role are required')
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'socialLinks') {
          fd.append(key, JSON.stringify(value))
        } else if (typeof value === 'boolean') {
          fd.append(key, value.toString())
        } else if (value !== '' && value !== null && value !== undefined) {
          fd.append(key, value)
        }
      })
      if (imageFile) fd.append('image', imageFile)

      if (editId) {
        await API.put(`/team/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await API.post('/team', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
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
    if (!window.confirm('Delete this team member?')) return
    setDeleting(id)
    try {
      await API.delete(`/team/${id}`)
      fetchAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const imgSrc = (img) => {
    if (!img) return '/assets/images/team-person1.jpg'
    if (img.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${img}`
    return img
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-users" /> Team Members</h1>
        <button className="admin-btn admin-btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-pen" /> {editId ? 'Edit Team Member' : 'New Team Member'}
          </div>
          <form onSubmit={handleSave}>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Emma Collins" required />
              </div>
              <div className="admin-form-group">
                <label>Role *</label>
                <input name="role" value={form.role} onChange={handleChange} placeholder="e.g. Chief Medical Officer" required />
              </div>
              <div className="admin-form-group">
                <label>Order</label>
                <input name="order" type="number" value={form.order} onChange={handleChange} placeholder="0" />
              </div>
              <div className="admin-form-group">
                <label>Photo</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
              </div>
              <div className="admin-form-group admin-form-full">
                <label>Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Short bio..." />
              </div>
              <div className="admin-form-group">
                <label>Facebook URL</label>
                <input name="social.facebook" value={form.socialLinks.facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
              </div>
              <div className="admin-form-group">
                <label>Instagram URL</label>
                <input name="social.instagram" value={form.socialLinks.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
              </div>
              <div className="admin-form-group">
                <label>LinkedIn URL</label>
                <input name="social.linkedin" value={form.socialLinks.linkedin} onChange={handleChange} placeholder="https://linkedin.com/..." />
              </div>
              <div className="admin-form-group">
                <label>Twitter URL</label>
                <input name="social.twitter" value={form.socialLinks.twitter} onChange={handleChange} placeholder="https://twitter.com/..." />
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
            <i className="fa-solid fa-users" style={{ fontSize: 38, display: 'block', marginBottom: 12, color: 'var(--text-light)' }} />
            <p style={{ marginBottom: 16 }}>No team members yet.</p>
            <button className="admin-btn admin-btn-primary" onClick={openNew}>
              <i className="fa-solid fa-plus" /> Add Member
            </button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>Photo</th>
                <th>Name</th>
                <th>Role</th>
                <th>Order</th>
                <th>Status</th>
                <th style={{ width: 110 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(m => (
                <tr key={m._id}>
                  <td><img src={imgSrc(m.image)} alt={m.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: '50%' }} /></td>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}>{m.role}</td>
                  <td>{m.order}</td>
                  <td>
                    <span className={`status-badge ${m.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                      {m.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="admin-btn admin-btn-outline admin-btn-xs" onClick={() => openEdit(m._id)} title="Edit">
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-xs" onClick={() => handleDelete(m._id)} disabled={deleting === m._id} title="Delete">
                        <i className={`fa-solid ${deleting === m._id ? 'fa-spinner fa-spin' : 'fa-trash'}`} />
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

export default AdminTeam
