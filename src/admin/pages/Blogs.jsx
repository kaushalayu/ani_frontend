import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/api'

function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const emptyForm = {
    title: '', excerpt: '', content: '', category: 'Advices',
    author: 'Admin', isPublished: true,
  }
  const [form, setForm] = useState(emptyForm)

  const CATEGORIES = ['Advices', 'Announcements', 'News', 'Consultation', 'Development']

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      // Admin sees all (including unpublished) - call without isPublished filter
      const { data } = await API.get('/blogs?limit=50')
      setBlogs(data.blogs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBlogs() }, [])

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

  const openEdit = (blog) => {
    setEditId(blog._id)
    setForm({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || 'Advices',
      author: blog.author || 'Admin',
      isPublished: blog.isPublished !== false,
    })
    setImageFile(null)
    setImagePreview(
      blog.image
        ? blog.image.startsWith('/uploads')
          ? `http://localhost:5000${blog.image}`
          : blog.image
        : ''
    )
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.content) {
      alert('Title and Content are required.')
      return
    }
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v.toString()))
      if (imageFile) formData.append('image', imageFile)

      if (editId) {
        await API.put(`/blogs/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await API.post('/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      setShowForm(false)
      fetchBlogs()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save blog')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return
    setDeleting(id)
    try {
      await API.delete(`/blogs/${id}`)
      fetchBlogs()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Blog Posts</h1>
        <button className="admin-btn admin-btn-primary" onClick={openNew}>+ New Post</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 9999, overflowY: 'auto', padding: '40px 16px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 700 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{editId ? 'Edit Blog Post' : 'New Blog Post'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Blog title..." required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Author</label>
                  <input name="author" value={form.author} onChange={handleChange} placeholder="Admin" />
                </div>
              </div>
              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label>Featured Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <img src={imagePreview} alt="preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8, border: '1px solid #e5e7eb' }} />
                )}
              </div>
              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label>Excerpt <span style={{ color: '#9ca3af', fontSize: 12 }}>(short summary, max 300 chars)</span></label>
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="Short description..." maxLength={300} />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label>Content *</label>
                <textarea name="content" value={form.content} onChange={handleChange} rows={6} placeholder="Full blog content..." required />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                  <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
                  Published (visible on site)
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editId ? 'Update Post' : 'Publish Post'}
                </button>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-loading">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="admin-empty">No blog posts yet. Click "New Post" to add one.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => {
                const imgSrc = blog.image
                  ? blog.image.startsWith('/uploads')
                    ? `http://localhost:5000${blog.image}`
                    : blog.image
                  : null
                return (
                  <tr key={blog._id}>
                    <td>
                      {imgSrc ? (
                        <img src={imgSrc} alt={blog.title} className="admin-product-img" />
                      ) : (
                        <div style={{ width: 48, height: 48, background: '#f3f4f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 18 }}>
                          📰
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 240 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{blog.views || 0} views</div>
                    </td>
                    <td>
                      <span style={{ background: '#e0e7ff', color: '#3730a3', fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
                        {blog.category}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{blog.author}</td>
                    <td>
                      <span className={`status-badge ${blog.isPublished ? 'status-delivered' : 'status-cancelled'}`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: '#6b7280' }}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(blog)}>Edit</button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(blog._id)}
                          disabled={deleting === blog._id}
                        >
                          {deleting === blog._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminBlogs
