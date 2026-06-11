import { useEffect } from 'react'
import API from '../utils/api'

function SeoUpdater() {
  useEffect(() => {
    let cancelled = false

    const fetchSeo = async () => {
      try {
        const { data } = await API.get('/seo')
        if (cancelled || !data.seo) return

        const s = data.seo

        document.title = s.siteTitle || 'Pharmez - Online Pharmacy'

        const setMeta = (name, content) => {
          if (!content) return
          let el = document.querySelector(`meta[name="${name}"]`)
          if (!el) {
            el = document.createElement('meta')
            el.setAttribute('name', name)
            document.head.appendChild(el)
          }
          el.setAttribute('content', content)
        }

        const setMetaProperty = (property, content) => {
          if (!content) return
          let el = document.querySelector(`meta[property="${property}"]`)
          if (!el) {
            el = document.createElement('meta')
            el.setAttribute('property', property)
            document.head.appendChild(el)
          }
          el.setAttribute('content', content)
        }

        setMeta('description', s.siteDescription)
        setMeta('keywords', s.siteKeywords)

        setMetaProperty('og:title', s.ogTitle || s.siteTitle)
        setMetaProperty('og:description', s.ogDescription || s.siteDescription)
        if (s.ogImage) {
          setMetaProperty('og:image', `http://localhost:5000${s.ogImage}`)
        }

        if (s.siteIcon) {
          const iconUrl = `http://localhost:5000${s.siteIcon}`
          let link = document.querySelector('link[rel="icon"]')
          if (link) {
            link.href = iconUrl
          }
          let appleLink = document.querySelector('link[rel="apple-touch-icon"]')
          if (appleLink) {
            appleLink.href = iconUrl
          }
        }
      } catch (err) {
        console.error('SeoUpdater: failed to fetch SEO', err)
      }
    }

    fetchSeo()
    return () => { cancelled = true }
  }, [])

  return null
}

export default SeoUpdater
