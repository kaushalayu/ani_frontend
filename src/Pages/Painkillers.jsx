import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../Components/ProductCard'
import './CategoryProducts.css'

function Painkillers() {
  // badge regex match — "pain", "Painkiller", "Relief", etc.
  const { products, loading, error } = useProducts({ badge: 'pain', limit: 20 })

  return (
    <div className="category-page" style={{ '--accent': '#0f766e', '--accent-light': '#14b8a6', '--accent-lighter': '#2dd4bf', '--accent-dark': '#115e59' }}>
      <div className="container">
        <div className="category-banner">
          <h1>Painkillers</h1>
          <p>Effective pain relief solutions — fast-acting and reliable for your comfort and well-being.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item active" aria-current="page">Painkillers</span>
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
            <i className="fa-solid fa-pills" style={{ fontSize: 40, marginBottom: 12, color: '#14b8a6' }} />
            <p style={{ fontWeight: 600, fontSize: 16 }}>No painkiller products found.</p>
            <p style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>
              Add products from Admin Panel with badge containing <strong>"pain"</strong>.
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

export default Painkillers
