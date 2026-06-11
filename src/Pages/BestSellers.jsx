import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../Components/ProductCard'
import './CategoryProducts.css'

function BestSellers() {
  const { products, loading, error } = useProducts({ isBestSeller: true, limit: 12 })

  return (
    <div className="category-page" style={{ '--accent': '#ea580c', '--accent-light': '#f97316', '--accent-lighter': '#fb923c', '--accent-dark': '#c2410c' }}>
      <div className="container">
        <div className="category-banner">
          <h1>Best Sellers</h1>
          <p>Our most popular products — trusted and loved by thousands of customers worldwide.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item active" aria-current="page">Best Sellers</span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32 }} />
            <p style={{ marginTop: 12 }}>Loading products...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#e05b5b' }}>{error}</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <p>No best sellers found. Admin can mark products as Best Seller from the panel.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} layout="category" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BestSellers
