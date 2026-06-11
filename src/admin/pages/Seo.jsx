import { useEffect, useState } from 'react'
import API from '../../utils/api'

function AdminSeo() {
  const [seo, setSeo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [iconFile, setIconFile] = useState(null)
  const [iconPreview, setIconPreview] = useState('')
  const [ogFile, setOgFile] = useState(null)
  const [ogPreview, setOgPreview] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  const [form, setForm] = useState({
    siteTitle: '',
    siteDescription: '',
    siteKeywords: '',
    ogTitle: '',
    ogDescription: '',
    footerText: '',
  })

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const { data } = await API.get('/seo')
        if (data.seo) {
          setSeo(data.seo)
          setForm({
            siteTitle: data.seo.siteTitle || '',
            siteDescription: data.seo.siteDescription || '',
            siteKeywords: data.seo.siteKeywords || '',
            ogTitle: data.seo.ogTitle || '',
            ogDescription: data.seo.ogDescription || '',
            footerText: data.seo.footerText || '',
          })
          if (data.seo.siteIcon) setIconPreview(`${import.meta.env.VITE_API_URL}${data.seo.siteIcon}`)
          if (data.seo.ogImage) setOgPreview(`${import.meta.env.VITE_API_URL}${data.seo.ogImage}`)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSeo()
  }, [])

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      await API.put('/admin/seo', form)
      setMessage({ type: 'success', text: 'SEO settings saved successfully!' })

      if (iconFile) {
        const iconData = new FormData()
        iconData.append('icon', iconFile)
        await API.post('/admin/seo/upload-icon', iconData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      if (ogFile) {
        const ogData = new FormData()
        ogData.append('ogImage', ogFile)
        await API.post('/admin/seo/upload-og-image', ogData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      const { data } = await API.get('/seo')
      if (data.seo) {
        setSeo(data.seo)
        if (data.seo.siteIcon) setIconPreview(`${import.meta.env.VITE_API_URL}${data.seo.siteIcon}`)
        if (data.seo.ogImage) setOgPreview(`${import.meta.env.VITE_API_URL}${data.seo.ogImage}`)
      }
      setIconFile(null)
      setOgFile(null)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save SEO settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="admin-loading">
      <div className="admin-loader" />
      <div>Loading SEO settings...</div>
    </div>
  )

  return (
    <div>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-magnifying-glass-chart" style={{ marginRight: 10, color: 'var(--primary)' }} />SEO Settings</h1>
      </div>

      {message.text && (
        <div className={`admin-toast admin-toast-${message.type}`}>
          <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`} />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-hospital" /> Site Identity
          </div>

          <div className="admin-form-group" style={{ marginBottom: 16 }}>
            <label>Site Icon / Favicon</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files[0]
              if (f) { setIconFile(f); setIconPreview(URL.createObjectURL(f)) }
            }} />
            {iconPreview && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={iconPreview} alt="icon preview" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Current icon</span>
              </div>
            )}
          </div>

          <div className="admin-form-group" style={{ marginBottom: 16 }}>
            <label>Site Title <span style={{ color: 'var(--text-light)', fontSize: 12 }}>(browser tab title)</span></label>
            <input name="siteTitle" value={form.siteTitle} onChange={handleChange} placeholder="Pharmez - Online Pharmacy" />
          </div>

          <div className="admin-form-group" style={{ marginBottom: 16 }}>
            <label>Meta Description <span style={{ color: 'var(--text-light)', fontSize: 12 }}>(max 320 chars)</span></label>
            <textarea name="siteDescription" value={form.siteDescription} onChange={handleChange} rows={3} placeholder="Brief description of your site..." maxLength={320} />
            <span style={{ fontSize: 11, color: 'var(--text-light)', textAlign: 'right' }}>{form.siteDescription.length}/320</span>
          </div>

          <div className="admin-form-group" style={{ marginBottom: 16 }}>
            <label>Meta Keywords <span style={{ color: 'var(--text-light)', fontSize: 12 }}>(comma separated)</span></label>
            <input name="siteKeywords" value={form.siteKeywords} onChange={handleChange} placeholder="pharmacy, online pharmacy, medicines" />
          </div>
        </div>

        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-share-nodes" /> Open Graph (Social Sharing)
          </div>

          <div className="admin-form-group" style={{ marginBottom: 16 }}>
            <label>OG Image <span style={{ color: 'var(--text-light)', fontSize: 12 }}>(1200x630 recommended)</span></label>
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files[0]
              if (f) { setOgFile(f); setOgPreview(URL.createObjectURL(f)) }
            }} />
            {ogPreview && (
              <div style={{ marginTop: 8 }}>
                <img src={ogPreview} alt="og preview" style={{ width: 240, height: 126, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
              </div>
            )}
          </div>

          <div className="admin-form-group" style={{ marginBottom: 16 }}>
            <label>OG Title <span style={{ color: 'var(--text-light)', fontSize: 12 }}>(leave empty to use Site Title)</span></label>
            <input name="ogTitle" value={form.ogTitle} onChange={handleChange} placeholder="Same as site title if left empty" />
          </div>

          <div className="admin-form-group" style={{ marginBottom: 16 }}>
            <label>OG Description <span style={{ color: 'var(--text-light)', fontSize: 12 }}>(leave empty to use Site Description)</span></label>
            <textarea name="ogDescription" value={form.ogDescription} onChange={handleChange} rows={2} placeholder="Same as site description if left empty" maxLength={320} />
          </div>
        </div>

        <div className="admin-form-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-title">
            <i className="fa-solid fa-rectangle-ad" /> Footer
          </div>

          <div className="admin-form-group" style={{ marginBottom: 16 }}>
            <label>Footer Text <span style={{ color: 'var(--text-light)', fontSize: 12 }}>(copyright / branding)</span></label>
            <input name="footerText" value={form.footerText} onChange={handleChange} placeholder="© 2025 Pharmez. All rights reserved." />
          </div>
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
          {saving ? 'Saving...' : 'Save SEO Settings'}
        </button>
      </form>
    </div>
  )
}

export default AdminSeo
