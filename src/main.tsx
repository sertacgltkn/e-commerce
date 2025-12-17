import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ComparisonProvider } from './context/ComparisonContext'
import { ToastProvider } from './context/ToastContext'
import { RecentlyViewedProvider } from './context/RecentlyViewedContext'
import { PriceAlertProvider } from './context/PriceAlertContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <ComparisonProvider>
              <RecentlyViewedProvider>
                <PriceAlertProvider>
                  <App />
                </PriceAlertProvider>
              </RecentlyViewedProvider>
            </ComparisonProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
