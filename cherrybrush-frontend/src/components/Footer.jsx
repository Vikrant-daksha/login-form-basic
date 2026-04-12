import React from "react";
import { Link } from "react-router-dom";
import {
  FaCopyright,
  FaHeart,
  FaInstagram,
  FaFacebook,
  FaPinterest,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal
} from "react-icons/fa";

export function Footer() {
  return (
    <>
      <footer className="bg-stone-900 text-stone-200 pt-16 pb-8 px-6 md:px-20 font-sans tracking-tight">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tighter text-white">WEBSELL STORE</h2>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Ecommerce Store with all the features you need to run your business. Browse products, add to cart, checkout, and more.
              {/* Elevating the DIY nail game with meticulously designed press-ons that reflect the artistry of the iconic Paintbox studio. */}
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors cursor-pointer"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors cursor-pointer"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors cursor-pointer"><FaPinterest size={20} /></a>
            </div>
          </div>

          {/* Shop Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Shop</h3>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><Link to="/catalog" className="hover:text-white transition-colors">All Collections</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Products Gallery</Link></li>
              {/* <li><Link to="/products?category=best" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/products?category=sale" className="hover:text-white transition-colors">Sale</Link></li> */}
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Support</h3>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><Link to="/#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          {/* <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Newsletter</h3>
            <p className="text-stone-400 text-sm">Join the club for early access to new launches.</p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="email@example.com"
                className="bg-stone-800 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-white outline-none"
              />
              <button className="bg-white text-black font-bold py-3 text-xs uppercase tracking-[0.2em] hover:bg-stone-200 transition-all">
                Subscribe
              </button>
            </div>
          </div> */}
        </div>

        {/* Footer Bottom */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-stone-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <FaCopyright /> 2026 WEBSELL STORE. All Rights Reserved.
          </div>

          <div className="flex items-center gap-4">
            <FaCcVisa size={24} className="opacity-50 hover:opacity-100 transition-opacity" />
            <FaCcMastercard size={24} className="opacity-50 hover:opacity-100 transition-opacity" />
            <FaCcPaypal size={24} className="opacity-50 hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex items-center">
            Made with <FaHeart className="mx-1.5 text-red-800" /> in India
          </div>
        </div>
      </footer>

      {/* 
      <footer
        id="Desktop"
        className="hidden bg-secondary px-16 py-10 md:flex justify-evenly text-center text-wrap uppercase text-[14px] border-b border-gray-400"
      >
        <ul className="px-8 space-y-1">
          <li className="mb-2 text-[12px] font-light">SUPPORT</li>
          <li>Privacy Policy</li>
          <li>Terms and Conditions</li>
          <li>Accessibility</li>
          <li>Contact Us</li>
        </ul>
        <div className="border-r border-black"></div>
        <ul className="px-8  space-y-1">
          <li className="mb-2 text-[12px] font-light">CHERRYBRUSH</li>
          <li>Our Studio</li>
          <li>Careers</li>
          <li>Press</li>
          <li>Shop</li>
        </ul>
        <div className="border-l border-black"></div>
        <ul className="px-8  space-y-1">
          <li className="mb-2 text-[12px] font-light">FOLLOW US</li>
          <li>Instagram</li>
          <li>Pintrest</li>
          <li>Facebook</li>
        </ul>
      </footer>
      <footer
        id="Mobile"
        className="flex flex-col px-4 mb-2 text-center uppercase md:hidden border-b border-gray-400"
      >
        <details className="w-full">
          <summary className="border-b cursor-pointer font-semibold py-3 list-none">
            Support
          </summary>
          <ul className="w-full bg-gray-50 mb-2 space-y-1 font-light py-2">
            <li>Privacy Policy</li>
            <li>Terms and Conditions</li>
            <li>Accessibility</li>
            <li>Contact Us</li>
          </ul>
        </details>
        <details className="w-full">
          <summary className="border-b cursor-pointer font-semibold py-3 list-none">
            Cherrybrush
          </summary>
          <ul className="w-full bg-gray-50 mb-2 space-y-1 font-light py-2">
            <li>Our Studio</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Shop</li>
          </ul>
        </details>
        <details className="w-full">
          <summary className="border-b cursor-pointer font-semibold py-3 list-none">
            Follow us
          </summary>
          <ul className="w-full bg-gray-50 mb-2 space-y-1 font-light py-2">
            <li>Instagram</li>
            <li>Pintrest</li>
            <li>Facebook</li>
          </ul>
        </details>
      </footer>
      <div className="text-[10px] px-2 py-3.5 flex justify-between items-center sm:text-sm sm:px-5">
        <span className="flex items-center">
          <FaCopyright className="mr-1" /> Copyrights Reserved.
        </span>
        <p className="flex items-center">
          Made with{" "}
          <span className="mx-1.5">
            <FaHeart />
          </span>{" "}
          in India.
        </p>
      </div>
      */}
    </>
  );
}
