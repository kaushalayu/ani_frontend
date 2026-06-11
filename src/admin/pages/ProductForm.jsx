import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import API from '../../utils/api'

const defaultPillsOption = { count: '', price: '', oldPrice: '', stock: '' }

function ProductForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    brand: 'Pharmez Healthcare',
    sku: '',
    badge: '',
    price: '',
    oldPrice: '',
    stock: '',
    hasPillsOptions: false,
    pillsOptions: [{ ...defaultPillsOption }],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isActive: true,
    howToUse: '',
    sideEffects: '',
    ingredients: '',
    additionalInfo: '',
  })

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data.categories))
  }, [])

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      API.get(`/products/${id}`)
        .then(({ data }) => {
          const p = data.product
          setForm({
            name: p.name || '',
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            category: p.category?._id || '',
            brand: p.brand || 'Pharmez Healthcare',
            sku: p.sku || '',
            badge: p.badge || '',
            price: p.price || '',
            oldPrice: p.oldPrice || '',
            stock: p.stock || '',
            hasPillsOptions: p.hasPillsOptions || false,
            pillsOptions: p.pillsOptions?.length > 0
              ? p.pillsOptions
              : [{ ...defaultPillsOption }],
            isFeatured: p.isFeatured || false,
            isNewArrival: p.isNewArrival || false,
            isBestSeller: p.isBestSeller || false,
            isActive: p.isActive !== undefined ? p.isActive : true,
            howToUse: p.howToUse || '',
            sideEffects: p.sideEffects || '',
            ingredients: p.ingredients || '',
            additionalInfo: p.additionalInfo || '',
          })
          if (p.image) {
            setImagePreview(
              p.image.startsWith('/uploads')
                ? `${import.meta.env.VITE_API_URL}${p.image}`
                : p.image
            )
          }
        })
        .catch(() => alert('Failed to load product'))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handlePillsOptionChange = (index, field, value) => {
    setForm((prev) => {
      const opts = [...prev.pillsOptions]
      opts[index] = { ...opts[index], [field]: value }
      return { ...prev, pillsOptions: opts }
    })
  }

  const addPillsOption = () => {
    setForm((prev) => ({
      ...prev,
      pillsOptions: [...prev.pillsOptions, { ...defaultPillsOption }],
    }))
  }

  const removePillsOption = (index) => {
    setForm((prev) => ({
      ...prev,
      pillsOptions: prev.pillsOptions.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'pillsOptions') {
          formData.append(key, JSON.stringify(value))
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString())
        } else if (value !== '' && value !== null && value !== undefined) {
          formData.append(key, value)
        }
      })
      if (imageFile) formData.append('image', imageFile)

      if (isEdit) {
        await API.put(`/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      navigate('/admin/products')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="admin-loading">
      <div className="admin-loader" />
      <div>Loading...</div>
    </div>
  )

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <Link to="/admin/products" className="admin-btn admin-btn-outline">
          <i className="fa-solid fa-arrow-left" /> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-circle-info" /> Basic Information
          </div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. ImmunoBoost" />
            </div>
            <div className="admin-form-group">
              <label>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. PHM-001" />
            </div>
            <div className="admin-form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Badge / Type</label>
              <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. Vitamin, Herbal, Cream" />
            </div>
            <div className="admin-form-group">
              <label>Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} />
            </div>
            <div className="admin-form-group">
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, marginTop: 8, border: '1px solid var(--border)' }} />
              )}
            </div>
            <div className="admin-form-group admin-form-full">
              <label>Short Description</label>
              <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="One-line summary" />
            </div>
            <div className="admin-form-group admin-form-full">
              <label>Full Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Detailed product description..." />
            </div>
          </div>
        </div>

        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-tag" /> Pricing & Stock
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <label className="admin-flag-label" style={{ border: 'none', padding: 0 }}>
              <input type="checkbox" name="hasPillsOptions" checked={form.hasPillsOptions} onChange={handleChange} />
              <i className="fa-solid fa-pills" style={{ color: 'var(--primary)' }} /> Has Pills Options
            </label>
          </div>

          {form.hasPillsOptions ? (
            <div>
              {form.pillsOptions.map((opt, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 10, marginBottom: 10, alignItems: 'end' }}>
                  <div className="admin-form-group">
                    {i === 0 && <label>Count</label>}
                    <input type="number" placeholder="e.g. 30" value={opt.count} onChange={(e) => handlePillsOptionChange(i, 'count', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    {i === 0 && <label>Price ($)</label>}
                    <input type="number" step="0.01" placeholder="e.g. 63.00" value={opt.price} onChange={(e) => handlePillsOptionChange(i, 'price', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    {i === 0 && <label>Old Price</label>}
                    <input type="number" step="0.01" placeholder="e.g. 89.00" value={opt.oldPrice} onChange={(e) => handlePillsOptionChange(i, 'oldPrice', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    {i === 0 && <label>Stock</label>}
                    <input type="number" placeholder="e.g. 100" value={opt.stock} onChange={(e) => handlePillsOptionChange(i, 'stock', e.target.value)} />
                  </div>
                  <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removePillsOption(i)} style={{ marginBottom: 0 }}>
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              ))}
              <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={addPillsOption}>
                <i className="fa-solid fa-plus" /> Add Option
              </button>
            </div>
          ) : (
            <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="admin-form-group">
                <label>Price ($) *</label>
                <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="0.00" />
              </div>
              <div className="admin-form-group">
                <label>Old Price ($)</label>
                <input type="number" step="0.01" name="oldPrice" value={form.oldPrice} onChange={handleChange} placeholder="0.00" />
              </div>
              <div className="admin-form-group">
                <label>Stock</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" />
              </div>
            </div>
          )}
        </div>

        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-flag" /> Product Flags
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              { name: 'isFeatured', label: 'Featured', icon: 'fa-solid fa-star' },
              { name: 'isNewArrival', label: 'New Arrival', icon: 'fa-solid fa-clock' },
              { name: 'isBestSeller', label: 'Best Seller', icon: 'fa-solid fa-fire' },
              { name: 'isActive', label: 'Active (visible)', icon: 'fa-solid fa-eye' },
            ].map((flag) => (
              <label key={flag.name} className="admin-flag-label">
                <input type="checkbox" name={flag.name} checked={form[flag.name]} onChange={handleChange} />
                <i className={flag.icon} style={{ color: form[flag.name] ? 'var(--primary)' : 'var(--text-light)' }} />
                {flag.label}
              </label>
            ))}
          </div>
        </div>

        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-circle-plus" /> Additional Information
          </div>
          <div className="admin-form-grid">
            <div className="admin-form-group admin-form-full">
              <label>Ingredients</label>
              <textarea name="ingredients" value={form.ingredients} onChange={handleChange} rows={3} placeholder="List of ingredients..." />
            </div>
            <div className="admin-form-group admin-form-full">
              <label>How to Use</label>
              <textarea name="howToUse" value={form.howToUse} onChange={handleChange} rows={3} placeholder="Dosage and usage instructions..." />
            </div>
            <div className="admin-form-group admin-form-full">
              <label>Side Effects</label>
              <textarea name="sideEffects" value={form.sideEffects} onChange={handleChange} rows={3} placeholder="Known side effects..." />
            </div>
            <div className="admin-form-group admin-form-full">
              <label>Additional Info</label>
              <textarea name="additionalInfo" value={form.additionalInfo} onChange={handleChange} rows={3} placeholder="Other details..." />
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <Link to="/admin/products" className="admin-btn admin-btn-outline">
              <i className="fa-solid fa-xmark" /> Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
