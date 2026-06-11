import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Preloader from './Preloader'
import ErrorBoundary from './ErrorBoundary'
import SeoUpdater from './SeoUpdater'
import { CartProvider } from '../Context/CartContext'
import { WishlistProvider } from '../Context/WishlistContext'
import { AuthProvider } from '../Context/AuthContext'
import { ToastProvider } from './Toast'

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <a id="button" className={show ? 'show' : ''} onClick={scrollToTop}></a>
  )
}

function SearchOverlay() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onSearchClick = (e) => {
      const href = e.target.closest('a')?.getAttribute('href')
      if (href === '#search') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('click', onSearchClick)
    return () => document.removeEventListener('click', onSearchClick)
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') setOpen(false) }
    if (open) {
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div id="search" className={open ? 'open' : ''}>
      <span className="close" onClick={() => setOpen(false)}>X</span>
      <form role="search" id="searchform" method="get">
        <input name="q" type="search" placeholder="Type to Search" />
      </form>
    </div>
  )
}

function Layout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
            <SeoUpdater />
            <Preloader />
            <BackToTop />
            <SearchOverlay />
            <Header />
            <main>
              <Outlet />
            </main>
            <Footer />
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default Layout
