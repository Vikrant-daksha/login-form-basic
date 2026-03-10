import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import React from "react";
import { Account } from "./pages/AccountPage";
import { Login } from "./pages/LoginPage";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { useAuth } from "./context/Authcontext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Product } from "./pages/product.jsx";
import { Collections } from "./pages/collections";
import { Layout } from "./Layout";
import { ProductDetails } from "./pages/ProductPage.jsx";
import { Catalog } from "./pages/Catalog";
import SearchPage from "./pages/SearchPage";
import Cart from "./components/cart";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route
            path="/product"
            element={
              <ProtectedRoute adminOnly={true}>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/success/:orderId"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-history/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          {/* Admin Protected Route Example */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <div>Admin Dashboard - Only for users with role 'admin'</div>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
