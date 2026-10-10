import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { StoreProvider } from './lib/store'
import Home from './pages/Home'
import House from './pages/House'
import ProductPage from './pages/Product'
import Concierge from './pages/Concierge'
import { PrivePublic, PriveRoom } from './pages/Prive'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/casa/:slug" element={<House />} />
            <Route path="/produto/:slug" element={<ProductPage />} />
            <Route path="/concierge" element={<Concierge />} />
            <Route path="/prive" element={<PrivePublic />} />
            <Route path="/prive/sala" element={<PriveRoom />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  )
}
