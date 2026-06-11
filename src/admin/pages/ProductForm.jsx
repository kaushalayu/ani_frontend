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
                ? `http://localhost:5000${p.image}`
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

      // Append all fields
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'pillsOptions') {
          formData.append(key, JSON.stringify(value))
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString())
        } else if (value !== '' && value !== null && value !== undefined) {
          formData.append(key, value)
        }
      })

      if (imageFile) {
        formData.append('image', imageFile)
      }

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

  if (loading) return <div className="admin-loading">Loading...</div>

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <Link to="/admin/products" className="admin-btn admin-btn-outline">← Back</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-grid">
            {/* Name */}
            <div className="admin-form-group">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. ImmunoBoost" />
            </div>
            {/* SKU */}
            <div className="admin-form-group">
              <label>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. PHM-001" />
            </div>
            {/* Category */}
            <div className="admin-form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            {/* Badge / Type */}
            <div className="admin-form-group">
              <label>Badge / Type</label>
              <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. Vitamin, Herbal, Cream" />
            </div>
            {/* Brand */}
            <div className="admin-form-group">
              <label>Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} />
            </div>

            {/* Image Upload */}
            <div className="admin-form-group">
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, marginTop: 8, border: '1px solid #e5e7eb' }} />
              )}
            </div>

            {/* Short Description */}
            <div className="admin-form-group admin-form-full">
              <label>Short Description</label>
              <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="One-line summary" />
            </div>

            {/* Description */}
            <div className="admin-form-group admin-form-full">
              <label>Full Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Detailed product description..." />
            </div>
          </div>

          {/* Pricing Section */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 14 }}>Pricing & Stock</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                <input type="checkbox" name="hasPillsOptions" checked={form.hasPillsOptions} onChange={handleChange} />
                Has Pills Options (multiple qty/price combos)
              </label>
            </div>

            {form.hasPillsOptions ? (
              <div>
                {form.pillsOptions.map((opt, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 10, marginBottom: 10, alignItems: 'end' }}>
                    <div className="admin-form-group">
                      {i === 0 && <label>Pills Count</label>}
                      <input type="number" placeholder="e.g. 30" value={opt.count} onChange={(e) => handlePillsOptionChange(i, 'count', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      {i === 0 && <label>Price ($)</label>}
                      <input type="number" step="0.01" placeholder="e.g. 63.00" value={opt.price} onChange={(e) => handlePillsOptionChange(i, 'price', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      {i === 0 && <label>Old Price ($)</label>}
                      <input type="number" step="0.01" placeholder="e.g. 89.00" value={opt.oldPrice} onChange={(e) => handlePillsOptionChange(i, 'oldPrice', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      {i === 0 && <label>Stock</label>}
                      <input type="number" placeholder="e.g. 100" value={opt.stock} onChange={(e) => handlePillsOptionChange(i, 'stock', e.target.value)} />
                    </div>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removePillsOption(i)} style={{ marginBottom: 0 }}>✕</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={addPillsOption}>+ Add Option</button>
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

          {/* Flags */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 14 }}>Product Flags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {[
                { name: 'isFeatured', label: '⭐ Featured' },
                { name: 'isNewArrival', label: '🆕 New Arrival' },
                { name: 'isBestSeller', label: '🔥 Best Seller' },
                { name: 'isActive', label: '✅ Active (visible on site)' },
              ].map((flag) => (
                <label key={flag.name} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                  <input type="checkbox" name={flag.name} checked={form[flag.name]} onChange={handleChange} />
                  {flag.label}
                </label>
              ))}
            </div>
          </div>

          {/* Extra Info */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 14 }}>Additional Information (Optional)</h3>
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
          </div>

          {/* Actions */}
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <Link to="/admin/products" className="admin-btn admin-btn-outline">Cancel</Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
