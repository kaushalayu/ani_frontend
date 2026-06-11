import { Link } from 'react-router-dom'
import { useWishlist } from '../Context/WishlistContext'
import { useCart } from '../Context/CartContext'
import { useToast } from '../Components/Toast'
import './Wishlist.css'

function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { addToast } = useToast()

  // Handle both /uploads/ (backend) and /assets/ (static) images
  const getImgSrc = (img) => {
    if (!img) return '/assets/images/best-product1.png'
    if (img.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${img}`
    if (img.startsWith('http')) return img
    return img
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-banner">
          <h1>My Wishlist</h1>
          <p>Your favorite products, all in one place — ready whenever you are.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item active" aria-current="page">Wishlist</span>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <i className="fa-regular fa-heart" />
            </div>
            <h3>Your wishlist is empty</h3>
            <p>Save your favorite products here and shop them anytime.</p>
            <Link to="/shop" className="wishlist-shop-btn">Browse Products</Link>
          </div>
        ) : (
          <div className="wishlist-content">
            <div className="wishlist-header">
              <h2>Saved Items ({wishlist.length})</h2>
              <button
                className="wishlist-clear-btn"
                onClick={() => { clearWishlist(); addToast('Wishlist cleared', 'info') }}
              >
                Clear All
              </button>
            </div>

            <div className="wishlist-grid">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-card">
                  <div className="wishlist-card-image">
                    <Link to={`/product/${item.id}`}>
                      <img src={getImgSrc(item.img)} alt={item.name} />
                    </Link>
                    {/* Remove from wishlist */}
                    <button
                      className="wishlist-card-remove"
                      onClick={() => {
                        removeFromWishlist(item.id)
                        addToast('Removed from wishlist', 'info')
                      }}
                      title="Remove from wishlist"
                    >
                      <i className="fa-solid fa-times" />
                    </button>
                    {/* Heart badge — filled since it's in wishlist */}
                    <span className="wishlist-card-heart">
                      <i className="fa-solid fa-heart" />
                    </span>
                  </div>

                  <div className="wishlist-card-body">
                    <span className="wishlist-card-tag">{item.pills || item.tag || 'Product'}</span>
                    <h3><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
                    <div className="wishlist-card-footer">
                      <span className="wishlist-card-price">${(item.price || 0).toFixed(2)}</span>
                      <button
                        className="wishlist-card-cart"
                        title="Add to cart"
                        onClick={() => {
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            img: item.img,
                            pills: item.pills || item.tag || null,
                            qty: 1,
                          })
                          addToast('Added to cart', 'cart')
                        }}
                      >
                        <i className="fa-solid fa-cart-plus" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div style={{ padding: '20px 28px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
              <Link to="/shop" style={{ fontSize: 14, color: '#e84c6b', fontWeight: 600, textDecoration: 'none' }}>
                <i className="fa-solid fa-arrow-left" style={{ marginRight: 6 }} />
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
