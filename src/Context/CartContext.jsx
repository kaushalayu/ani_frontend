import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmez_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('pharmez_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id && p.pills === item.pills)
      if (existing) {
        return prev.map(p =>
          p.id === item.id && p.pills === item.pills
            ? { ...p, qty: p.qty + (item.qty || 1) }
            : p
        )
      }
      return [...prev, { ...item, qty: item.qty || 1 }]
    })
  }

  const removeFromCart = (id, pills) => {
    setCart(prev => prev.filter(p => !(p.id === id && p.pills === pills)))
  }

  const updateQty = (id, pills, qty) => {
    if (qty <= 0) {
      removeFromCart(id, pills)
      return
    }
    setCart(prev => prev.map(p =>
      p.id === id && p.pills === pills ? { ...p, qty } : p
    ))
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
