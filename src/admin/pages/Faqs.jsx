import { useEffect, useState } from 'react'
import API from '../../utils/api'

const emptyForm = {
  question: '', answer: '', order: 0, isActive: true,
}

function AdminFaqs() {
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
      const { data } = await API.get('/faqs?admin=true')
      setList(data.faqs)
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
      const { data } = await API.get(`/faqs/${id}`)
      const f = data.faq
      setForm({
        question: f.question || '',
        answer: f.answer || '',
        order: f.order || 0,
        isActive: f.isActive !== undefined ? f.isActive : true,
      })
    } catch {
      alert('Failed to load FAQ')
    }
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) return alert('Question and answer are required')
    setSaving(true)
    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
      }

      if (editId) {
        await API.put(`/faqs/${editId}`, payload)
      } else {
        await API.post('/faqs', payload)
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
    if (!window.confirm('Delete this FAQ?')) return
    setDeleting(id)
    try {
      await API.delete(`/faqs/${id}`)
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
        <h1><i className="fa-solid fa-question-circle" /> FAQs</h1>
        <button className="admin-btn admin-btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Add FAQ
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-pen" /> {editId ? 'Edit FAQ' : 'New FAQ'}
          </div>
          <form onSubmit={handleSave}>
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-full">
                <label>Question *</label>
                <input name="question" value={form.question} onChange={handleChange} placeholder="e.g. How do I place an order?" required />
              </div>
              <div className="admin-form-group admin-form-full">
                <label>Answer *</label>
                <textarea name="answer" value={form.answer} onChange={handleChange} rows={5} placeholder="Write the answer..." required />
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
            <i className="fa-solid fa-question-circle" style={{ fontSize: 38, display: 'block', marginBottom: 12, color: 'var(--text-light)' }} />
            <p style={{ marginBottom: 16 }}>No FAQs yet.</p>
            <button className="admin-btn admin-btn-primary" onClick={openNew}>
              <i className="fa-solid fa-plus" /> Add FAQ
            </button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th style={{ width: 110 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((f, i) => (
                  <tr key={f._id}>
                    <td style={{ color: 'var(--text-light)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{f.question}</td>
                    <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {f.answer}
                    </td>
                    <td>{f.order}</td>
                    <td>
                      <span className={`status-badge ${f.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        {f.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="admin-btn admin-btn-outline admin-btn-xs" onClick={() => openEdit(f._id)} title="Edit">
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button className="admin-btn admin-btn-danger admin-btn-xs" onClick={() => handleDelete(f._id)} disabled={deleting === f._id} title="Delete">
                          <i className={`fa-solid ${deleting === f._id ? 'fa-spinner fa-spin' : 'fa-trash'}`} />
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

export default AdminFaqs
