import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../Components/ProductCard'
import './CategoryProducts.css'

function Anxiety() {
  // badge regex match — "calm", "anxiety", "Anxie", etc.
  const { products, loading, error } = useProducts({ badge: 'anxi', limit: 20 })

  return (
    <div className="category-page" style={{ '--accent': '#5c45bf', '--accent-light': '#7c5ce7', '--accent-lighter': '#9b7efd', '--accent-dark': '#4a34a8' }}>
      <div className="container">
        <div className="category-banner">
          <h1>Anxiety Pills</h1>
          <p>Find your calm — explore our range of anxiety relief products for a balanced and peaceful mind.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item active" aria-current="page">Anxiety Pills</span>
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
            <i className="fa-solid fa-brain" style={{ fontSize: 40, marginBottom: 12, color: '#7c5ce7' }} />
            <p style={{ fontWeight: 600, fontSize: 16 }}>No anxiety products found.</p>
            <p style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>
              Add products from Admin Panel with badge containing <strong>"anxi"</strong>.
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

export default Anxiety
