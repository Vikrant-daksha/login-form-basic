import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import React from 'react';
import { Account } from './pages/AccountPage';
import { Login } from './pages/LoginPage';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { useAuth } from './context/Authcontext';
import ProtectedRoute from './components/ProtectedRoute';
import { Product } from './pages/product';
import { Collections } from './pages/collections';
import { Layout } from './Layout';
import { ProductDetails } from './pages/ProductPage.jsx';
import { Catalog } from './pages/Catalog';
import SearchPage from './pages/SearchPage';
import Cart from './components/cart';

function App() {
  const { user , loading } = useAuth()

  if(loading) return <p>Loading...</p>;

  return(
    <>
        <Routes>
            <Route element={<Layout/>}>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product" element={<Product/>} />
            <Route path="/collections" element={<Collections/>} />
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog/>} />
            <Route path='/search' element={<SearchPage/>} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            </Route>
        </Routes>
    </>
      );
    }

export default App
