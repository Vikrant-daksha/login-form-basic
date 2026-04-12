import {
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "./App.css";
import React, { useEffect } from "react";
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
import DiscountPage from "./pages/DiscountPage.jsx";
import CreatorComission from "./pages/CreatorComissions.jsx";
import AllUsers from "./pages/AllUsers.jsx";
import { Gallery } from "./pages/Gallery.jsx";

function App() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkLink = async () => {
      const link = searchParams.get("coupon");
      if (!link) return;
      localStorage.setItem("creatorCoupon", link);
      console.log(link);
    };

    checkLink();
  }, []);

  return (
    <>
      <div
        className={
          loading
            ? "fixed flex justify-center items-center w-full h-full bg-black z-1000"
            : "fixed flex justify-center items-center w-full h-full bg-black z-1000 transition duration-[1500ms] delay-100 ease-out -translate-y-full border-b border-white"
        }
      >
        <div>
          <img
            src="/loading.gif"
            alt="Cherrybrush"
            className="h-40 w-40 mr-5"
          />
        </div>
        <div className=" text-lg text-white tracking-wider uppercase">
          WEBSELL STORE
        </div>
      </div>
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
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route
            path="/product"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
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
              <ProtectedRoute allowedRoles={["admin"]}>
                <div>Admin Dashboard - Only for users with role 'admin'</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/discount"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DiscountPage />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/comissions"
            element={
              <ProtectedRoute allowedRoles={["admin", "creator"]}>
                <CreatorComission />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllUsers />
              </ProtectedRoute>
            }
          ></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
