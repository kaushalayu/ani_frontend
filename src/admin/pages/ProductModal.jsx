import { useEffect, useState, useRef } from 'react'
import API from '../../utils/api'
import './ProductModal.css'

const defaultPillsOption = { count: '', price: '', oldPrice: '', stock: '' }

// Badge options — must match what frontend category pages use for filtering
const BADGE_OPTIONS = [
  { value: '',            label: '— Select Badge —' },
  { value: 'sleep aid',   label: '😴 Sleep Aid  (Sleeping Pills page)' },
  { value: 'painkillers', label: '💊 Painkillers  (Painkillers page)' },
  { value: 'calm',        label: '🧘 Calm / Anxiety  (Anxiety page)' },
  { value: 'vitamin',     label: '🌿 Vitamin' },
  { value: 'herbal',      label: '🌱 Herbal' },
  { value: 'supplement',  label: '💡 Supplement' },
  { value: 'cream',       label: '🧴 Cream' },
  { value: 'syrup',       label: '🍶 Syrup' },
  { value: 'tablet',      label: '💊 Tablet' },
  { value: 'antibiotic',  label: '🔬 Antibiotic' },
  { value: 'other',       label: '📦 Other' },
]

const SECTION_TABS = [
  { id: 'basic',    label: 'Basic Info',    icon: 'fa-solid fa-circle-info' },
  { id: 'pricing',  label: 'Pricing',       icon: 'fa-solid fa-tag' },
  { id: 'flags',    label: 'Flags',         icon: 'fa-solid fa-flag' },
  { id: 'details',  label: 'Details',       icon: 'fa-solid fa-file-lines' },
]

function ProductModal({ productId, onClose, onSaved }) {
  const isEdit = !!productId
  const overlayRef = useRef(null)

  const [activeTab, setActiveTab] = useState('basic')
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [saving, setSaving]         = useState(false)
  const [toast, setToast]           = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile]   = useState(null)

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

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Fetch categories
  useEffect(() => {
    API.get('/categories')
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {})
  }, [])

  // Fetch product if editing
  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    API.get(`/products/${productId}`)
      .then(({ data }) => {
        const p = data.product
        setForm({
          name:             p.name || '',
          description:      p.description || '',
          shortDescription: p.shortDescription || '',
          category:         p.category?._id || '',
          brand:            p.brand || 'Pharmez Healthcare',
          sku:              p.sku || '',
          badge:            p.badge || '',
          price:            p.price || '',
          oldPrice:         p.oldPrice || '',
          stock:            p.stock || '',
          hasPillsOptions:  p.hasPillsOptions || false,
          pillsOptions:     p.pillsOptions?.length > 0 ? p.pillsOptions : [{ ...defaultPillsOption }],
          isFeatured:       p.isFeatured || false,
          isNewArrival:     p.isNewArrival || false,
          isBestSeller:     p.isBestSeller || false,
          isActive:         p.isActive !== undefined ? p.isActive : true,
          howToUse:         p.howToUse || '',
          sideEffects:      p.sideEffects || '',
          ingredients:      p.ingredients || '',
          additionalInfo:   p.additionalInfo || '',
        })
        if (p.image) {
          setImagePreview(
            p.image.startsWith('/uploads')
              ? `${import.meta.env.VITE_API_URL}${p.image}`
              : p.image
          )
        }
      })
      .catch(() => showToast('Failed to load product', 'error'))
      .finally(() => setLoading(false))
  }, [productId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handlePillsChange = (index, field, value) => {
    setForm(prev => {
      const opts = [...prev.pillsOptions]
      opts[index] = { ...opts[index], [field]: value }
      return { ...prev, pillsOptions: opts }
    })
  }

  const addPillsRow = () => setForm(prev => ({
    ...prev,
    pillsOptions: [...prev.pillsOptions, { ...defaultPillsOption }],
  }))

  const removePillsRow = (i) => setForm(prev => ({
    ...prev,
    pillsOptions: prev.pillsOptions.filter((_, idx) => idx !== i),
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())        return showToast('Product name is required', 'error')
    if (!form.description.trim()) return showToast('Description is required', 'error')

    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'pillsOptions') {
          fd.append(key, JSON.stringify(value))
        } else if (typeof value === 'boolean') {
          fd.append(key, value.toString())
        } else if (value !== '' && value !== null && value !== undefined) {
          fd.append(key, value)
        }
      })
      if (imageFile) fd.append('image', imageFile)

      const headers = { 'Content-Type': 'multipart/form-data' }
      if (isEdit) {
        await API.put(`/products/${productId}`, fd, { headers })
      } else {
        await API.post('/products', fd, { headers })
      }
      showToast(isEdit ? 'Product updated!' : 'Product created!', 'success')
      setTimeout(() => onSaved(), 600)
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pm-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="pm-modal">

        {/* ── Modal Header ── */}
        <div className="pm-header">
          <div className="pm-header-left">
            <div className="pm-header-icon">
              <i className={`fa-solid ${isEdit ? 'fa-pen-to-square' : 'fa-plus'}`} />
            </div>
            <div>
              <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
              <p>{isEdit ? 'Update product details below' : 'Fill in the product information'}</p>
            </div>
          </div>
          <button className="pm-close" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* ── Toast ── */}
        {toast && (
          <div className={`pm-toast pm-toast-${toast.type}`}>
            <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : toast.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}`} />
            {toast.msg}
          </div>
        )}

        {loading ? (
          <div className="pm-loading">
            <div className="admin-loader" />
            <span>Loading product...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* ── Tab Nav ── */}
            <div className="pm-tabs">
              {SECTION_TABS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={`pm-tab${activeTab === t.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <i className={t.icon} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div className="pm-body">

              {/* ══════════ TAB: BASIC INFO ══════════ */}
              {activeTab === 'basic' && (
                <div className="pm-section">
                  {/* Image upload — top of form */}
                  <div className="pm-image-upload">
                    <div
                      className="pm-image-drop"
                      onClick={() => document.getElementById('pm-img-input').click()}
                    >
                      {imagePreview
                        ? <img src={imagePreview} alt="preview" className="pm-image-preview" />
                        : (
                          <div className="pm-image-placeholder">
                            <i className="fa-solid fa-cloud-arrow-up" />
                            <span>Click to upload image</span>
                            <small>PNG, JPG up to 5MB</small>
                          </div>
                        )
                      }
                    </div>
                    <input
                      id="pm-img-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        className="pm-img-remove"
                        onClick={() => { setImagePreview(''); setImageFile(null) }}
                      >
                        <i className="fa-solid fa-xmark" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="pm-grid-2">
                    <div className="pm-field">
                      <label>Product Name <span className="pm-req">*</span></label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Zolpidem 10mg"
                        required
                      />
                    </div>
                    <div className="pm-field">
                      <label>SKU</label>
                      <input
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        placeholder="e.g. PHM-SLP-001"
                      />
                    </div>
                  </div>

                  <div className="pm-grid-2">
                    <div className="pm-field">
                      <label>Category <span className="pm-req">*</span></label>
                      <select name="category" value={form.category} onChange={handleChange}>
                        <option value="">Select Category</option>
                        {categories.map(c => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="pm-field">
                      <label>
                        Badge / Type
                        <span className="pm-field-hint">Controls navbar submenu display</span>
                      </label>
                      <select name="badge" value={form.badge} onChange={handleChange}>
                        {BADGE_OPTIONS.map(b => (
                          <option key={b.value} value={b.value}>{b.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pm-field">
                    <label>Brand</label>
                    <input
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      placeholder="e.g. Pharmez Healthcare"
                    />
                  </div>

                  <div className="pm-field">
                    <label>Short Description</label>
                    <input
                      name="shortDescription"
                      value={form.shortDescription}
                      onChange={handleChange}
                      placeholder="One-line product summary shown on cards"
                    />
                  </div>

                  <div className="pm-field">
                    <label>Full Description <span className="pm-req">*</span></label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Detailed product description..."
                      required
                    />
                  </div>
                </div>
              )}

              {/* ══════════ TAB: PRICING ══════════ */}
              {activeTab === 'pricing' && (
                <div className="pm-section">
                  {/* Pills toggle */}
                  <div className="pm-pills-toggle">
                    <label className="pm-switch-label">
                      <div className="pm-toggle-wrap">
                        <input
                          type="checkbox"
                          name="hasPillsOptions"
                          checked={form.hasPillsOptions}
                          onChange={handleChange}
                        />
                        <span className="pm-switch" />
                      </div>
                      <div>
                        <strong>Has Pills / Quantity Options</strong>
                        <p>Enable if the medicine comes in different pill counts with different prices (e.g. 30, 60, 90 pills)</p>
                      </div>
                    </label>
                  </div>

                  {form.hasPillsOptions ? (
                    <div className="pm-pills-table">
                      <div className="pm-pills-header">
                        <span>Pills Count</span>
                        <span>Price ($)</span>
                        <span>Old Price ($)</span>
                        <span>Stock</span>
                        <span></span>
                      </div>
                      {form.pillsOptions.map((opt, i) => (
                        <div key={i} className="pm-pills-row">
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 30"
                            value={opt.count}
                            onChange={e => handlePillsChange(i, 'count', e.target.value)}
                          />
                          <div className="pm-input-prefix">
                            <span>$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={opt.price}
                              onChange={e => handlePillsChange(i, 'price', e.target.value)}
                            />
                          </div>
                          <div className="pm-input-prefix">
                            <span>$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={opt.oldPrice}
                              onChange={e => handlePillsChange(i, 'oldPrice', e.target.value)}
                            />
                          </div>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={opt.stock}
                            onChange={e => handlePillsChange(i, 'stock', e.target.value)}
                          />
                          <button
                            type="button"
                            className="pm-pills-remove"
                            onClick={() => removePillsRow(i)}
                            disabled={form.pillsOptions.length === 1}
                          >
                            <i className="fa-solid fa-xmark" />
                          </button>
                        </div>
                      ))}
                      <button type="button" className="pm-pills-add" onClick={addPillsRow}>
                        <i className="fa-solid fa-plus" /> Add Another Option
                      </button>
                    </div>
                  ) : (
                    <div className="pm-grid-3">
                      <div className="pm-field">
                        <label>Price ($) <span className="pm-req">*</span></label>
                        <div className="pm-input-prefix">
                          <span>$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="pm-field">
                        <label>Old Price ($) <span style={{ color: 'var(--text-light)', fontSize: 11 }}>(optional)</span></label>
                        <div className="pm-input-prefix">
                          <span>$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="oldPrice"
                            value={form.oldPrice}
                            onChange={handleChange}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="pm-field">
                        <label>Stock</label>
                        <input
                          type="number"
                          min="0"
                          name="stock"
                          value={form.stock}
                          onChange={handleChange}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════ TAB: FLAGS ══════════ */}
              {activeTab === 'flags' && (
                <div className="pm-section">
                  <p className="pm-flags-hint">
                    Flags control where the product appears on the website.
                  </p>
                  <div className="pm-flags-grid">
                    {[
                      {
                        name: 'isFeatured',
                        label: 'Featured Product',
                        desc: 'Shows in "Our Featured Products" section on Home page',
                        icon: 'fa-solid fa-star',
                        color: '#f59e0b',
                      },
                      {
                        name: 'isNewArrival',
                        label: 'New Arrival',
                        desc: 'Shows on /new-arrivals page',
                        icon: 'fa-solid fa-clock',
                        color: '#3b82f6',
                      },
                      {
                        name: 'isBestSeller',
                        label: 'Best Seller',
                        desc: 'Shows in "Best Selling Products" on Home page & /best-sellers',
                        icon: 'fa-solid fa-fire',
                        color: '#ef4444',
                      },
                      {
                        name: 'isActive',
                        label: 'Active (visible)',
                        desc: 'Uncheck to hide product from all pages without deleting',
                        icon: 'fa-solid fa-eye',
                        color: '#10b981',
                      },
                    ].map(flag => (
                      <label key={flag.name} className={`pm-flag-card${form[flag.name] ? ' checked' : ''}`}>
                        <div className="pm-flag-card-inner">
                          <div className="pm-flag-icon" style={{ background: form[flag.name] ? flag.color + '22' : 'var(--bg)' }}>
                            <i className={flag.icon} style={{ color: form[flag.name] ? flag.color : 'var(--text-light)' }} />
                          </div>
                          <div className="pm-flag-text">
                            <strong>{flag.label}</strong>
                            <span>{flag.desc}</span>
                          </div>
                          <div className="pm-toggle-wrap" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                            <input
                              type="checkbox"
                              name={flag.name}
                              checked={form[flag.name]}
                              onChange={handleChange}
                            />
                            <span className="pm-switch" />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Badge info box */}
                  <div className="pm-badge-info">
                    <i className="fa-solid fa-circle-info" />
                    <div>
                      <strong>Navbar Submenu (Badge-based):</strong>
                      <p>Products appear in the navbar dropdown based on their <strong>Badge</strong> field (set in Basic Info tab):</p>
                      <ul>
                        <li><code>sleep aid</code> → Sleeping Pills submenu</li>
                        <li><code>painkillers</code> → Painkillers submenu</li>
                        <li><code>calm</code> → Anxiety submenu</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════ TAB: DETAILS ══════════ */}
              {activeTab === 'details' && (
                <div className="pm-section">
                  <div className="pm-field">
                    <label>Ingredients</label>
                    <textarea
                      name="ingredients"
                      value={form.ingredients}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Active and inactive ingredients..."
                    />
                  </div>
                  <div className="pm-field">
                    <label>How to Use / Dosage</label>
                    <textarea
                      name="howToUse"
                      value={form.howToUse}
                      onChange={handleChange}
                      rows={4}
                      placeholder="e.g. Take 1 tablet daily before bedtime with a glass of water..."
                    />
                  </div>
                  <div className="pm-field">
                    <label>Side Effects</label>
                    <textarea
                      name="sideEffects"
                      value={form.sideEffects}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Known side effects and warnings..."
                    />
                  </div>
                  <div className="pm-field">
                    <label>Additional Information</label>
                    <textarea
                      name="additionalInfo"
                      value={form.additionalInfo}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Storage, expiry, other notes..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="pm-footer">
              <div className="pm-footer-tabs">
                {SECTION_TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`pm-footer-dot${activeTab === t.id ? ' active' : ''}`}
                    onClick={() => setActiveTab(t.id)}
                    title={t.label}
                  />
                ))}
              </div>
              <div className="pm-footer-actions">
                <button type="button" className="admin-btn admin-btn-outline" onClick={onClose}>
                  Cancel
                </button>
                {activeTab !== 'details' && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-outline"
                    onClick={() => {
                      const idx = SECTION_TABS.findIndex(t => t.id === activeTab)
                      if (idx < SECTION_TABS.length - 1) setActiveTab(SECTION_TABS[idx + 1].id)
                    }}
                  >
                    Next <i className="fa-solid fa-arrow-right" />
                  </button>
                )}
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
                  {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProductModal
