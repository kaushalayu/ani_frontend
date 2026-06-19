import { useEffect, useState } from 'react'
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
          ? `${import.meta.env.VITE_API_URL}${blog.image}`
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
        <h1><i className="fa-solid fa-newspaper" style={{ marginRight: 10, color: 'var(--primary)' }} />Blog Posts</h1>
        <button className="admin-btn admin-btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> New Post
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editId ? 'Edit Blog Post' : 'New Blog Post'}</h2>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Blog title..." required />
              </div>
              <div className="admin-form-grid blog-form-grid" style={{ gap: 14, marginBottom: 14 }}>
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
                  <img src={imagePreview} alt="preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8, border: '1px solid var(--border)' }} />
                )}
              </div>
              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label>Excerpt <span style={{ color: 'var(--text-light)', fontSize: 12 }}>(max 300 chars)</span></label>
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="Short description..." maxLength={300} />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 14 }}>
                <label>Content *</label>
                <textarea name="content" value={form.content} onChange={handleChange} rows={6} placeholder="Full blog content..." required />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="admin-flag-label" style={{ display: 'inline-flex' }}>
                  <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
                  <i className="fa-solid fa-globe" style={{ color: form.isPublished ? 'var(--success)' : 'var(--text-light)' }} />
                  Published (visible on site)
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
                  {saving ? 'Saving...' : editId ? 'Update Post' : 'Publish Post'}
                </button>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowForm(false)}>
                  <i className="fa-solid fa-xmark" /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-loading">
            <div className="admin-loader" />
            <div>Loading blogs...</div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-file-pen" style={{ fontSize: 32, display: 'block', marginBottom: 8, color: 'var(--text-light)' }} />
            No blog posts yet. Click "New Post" to add one.
          </div>
        ) : (
          <div className="admin-table-wrap">
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
                      ? `${import.meta.env.VITE_API_URL}${blog.image}`
                      : blog.image
                    : null
                  return (
                    <tr key={blog._id}>
                      <td>
                        {imgSrc ? (
                          <img src={imgSrc} alt={blog.title} className="admin-product-img" />
                        ) : (
                          <div style={{ width: 44, height: 44, background: 'var(--bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: 18 }}>
                            <i className="fa-solid fa-file-lines" />
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, maxWidth: 240 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                          <i className="fa-regular fa-eye" style={{ marginRight: 3 }} />{blog.views || 0} views
                        </div>
                      </td>
                      <td>
                        <span style={{ background: '#e0e7ff', color: '#3730a3', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 10 }}>
                          {blog.category}
                        </span>
                      </td>
                      <td style={{ fontSize: 13 }}>{blog.author}</td>
                      <td>
                        <span className={`status-badge ${blog.isPublished ? 'status-delivered' : 'status-cancelled'}`}>
                          <i className={`fa-solid ${blog.isPublished ? 'fa-circle-check' : 'fa-circle-pause'}`} style={{ marginRight: 4 }} />
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        <i className="fa-regular fa-calendar" style={{ marginRight: 5 }} />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="admin-btn admin-btn-outline admin-btn-xs" onClick={() => openEdit(blog)}>
                            <i className="fa-solid fa-pen" /> Edit
                          </button>
                          <button
                            className="admin-btn admin-btn-danger admin-btn-xs"
                            onClick={() => handleDelete(blog._id)}
                            disabled={deleting === blog._id}
                          >
                            <i className={`fa-solid ${deleting === blog._id ? 'fa-spinner fa-spin' : 'fa-trash'}`} />
                            {deleting === blog._id ? '' : 'Delete'}
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

export default AdminBlogs
