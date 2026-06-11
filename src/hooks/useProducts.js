import { useState, useEffect } from 'react'
import API from '../utils/api'

/**
 * Generic hook to fetch products from the backend with filters.
 * @param {object} params - query params: { isFeatured, isNewArrival, isBestSeller, category, search, sort, page, limit }
 */
export function useProducts(params = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, v)
      })
      const { data } = await API.get(`/products?${query}`)
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [JSON.stringify(params)])

  return { products, loading, error, total, pages, refetch: fetchProducts }
}

/**
 * Hook to fetch a single product by id or slug.
 */
export function useSingleProduct(idOrSlug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!idOrSlug) return
    setLoading(true)
    setError(null)
    API.get(`/products/${idOrSlug}`)
      .then(({ data }) => setProduct(data.product))
      .catch((err) => setError(err.response?.data?.message || 'Product not found'))
      .finally(() => setLoading(false))
  }, [idOrSlug])

  return { product, loading, error }
}
