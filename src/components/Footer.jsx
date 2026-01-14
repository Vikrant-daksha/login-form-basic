import React from "react";
import { FaCopyright, FaHeart, FaRegCopy } from "react-icons/fa6";

export function Footer(){
    return(
        <>
        <footer id="Desktop" className="hidden bg-pink-100 mt-10 px-16 py-10 md:flex justify-evenly text-center text-wrap uppercase text-[14px] border-b border-gray-400">
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
        <footer id="Mobile" className="flex flex-col px-4 mb-2 text-center uppercase md:hidden border-b border-gray-400">
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
            <span className="flex items-center"><FaCopyright className="mr-1"/> Copyrights Reserved.</span>
            <p className="flex items-center">Made with <span className="mx-1.5"><FaHeart/></span> in India.</p>
        </div>
        </>
    )
}