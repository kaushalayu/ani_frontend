import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../Components/ProductCard'
import './CategoryProducts.css'

function SleepingPills() {
  // badge regex match — admin can use "sleep aid", "Sleep Aid", "sleeping", etc.
  const { products, loading, error } = useProducts({ badge: 'sleep', limit: 20 })

  return (
    <div className="category-page" style={{ '--accent': '#3730a3', '--accent-light': '#6366f1', '--accent-lighter': '#818cf8', '--accent-dark': '#312e81' }}>
      <div className="container">
        <div className="category-banner">
          <h1>Sleeping Pills</h1>
          <p>Restful nights start here — explore our range of sleep aids for peaceful and rejuvenating rest.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item active" aria-current="page">Sleeping Pills</span>
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
            <i className="fa-solid fa-moon" style={{ fontSize: 40, marginBottom: 12, color: '#6366f1' }} />
            <p style={{ fontWeight: 600, fontSize: 16 }}>No sleeping pill products found.</p>
            <p style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>
              Add products from Admin Panel with badge containing <strong>"sleep"</strong>.
            </p>
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

export default SleepingPills
