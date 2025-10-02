import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import React from 'react';
import Navbar from './components/Navbar';
import { Account } from './pages/AccountPage';
import { Services } from './pages/Services';
import { Login } from './pages/LoginPage';
import { Signin } from './pages/Signin';
import { Home } from './pages/Home';


function App() {
  return(
    <>
        <Navbar />
        <Routes>
            <Route path="/account" element={<Account />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/home" element={<Home />} />
        </Routes>       
    </>
      );
    }

export default App
