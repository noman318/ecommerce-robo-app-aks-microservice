import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import Layout from './components/Layout';
import { ineum, pageName } from './instana';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Payment from './pages/Payment';
import ProductPage from './pages/Product';
import Search from './pages/Search';
import Shipping from './pages/Shipping';
import Splash from './pages/Splash';

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    ineum('page', pageName(pathname));
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Splash />} />
        <Route path="search/:text" element={<Search />} />
        <Route path="product/:sku" element={<ProductPage />} />
        <Route path="login" element={<Login />} />
        <Route path="cart" element={<Cart />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="payment" element={<Payment />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
