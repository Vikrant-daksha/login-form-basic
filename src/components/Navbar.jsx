import { useState } from "react"
import React from "react"
import { Link } from "react-router-dom"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoClose } from "react-icons/io5"
import '../App.css'

function Navbar(){

    const [isOpen, setIsOpen] = useState(false)

    return(
    <div className="fixed top-0 z-10 w-full">
        <nav className="bg-amber-300">
            <div className="h-14 items-center flex justify-between">
            <div className="text-2xl px-8">
                <a href='/' className="font-bold">Logo</a>
            </div>
            <div className="hidden sm:block">
                <Link to="/services" className="text-lg px-5">Services</Link>
                <Link to="/account" className="text-lg px-5">Account</Link>
                <Link to="/login" className="text-lg px-5">Login</Link>
            </div>
                <button onClick={() => setIsOpen(!isOpen)} className="sm:hidden mr-4 text-2xl p-1.5"> { isOpen ? <IoClose /> : <GiHamburgerMenu />}</button>
            </div>
            <div className={`${
            isOpen ? "block" : "hidden"
            } absolute right-0 mr-4 font-extralight`}>
            <div className="flex flex-col sm:hidden bg-gray-200 ">
                <Link to="/services" className="block text-xl py-1.5 px-5 border-b-1">Services</Link>
                <Link to="/account" className="block text-xl py-1.5 px-5 border-b-1">Account</Link>
                <Link to="/login" className="block text-xl py-1.5 px-5 border-b-1">Login</Link>
            </div>
            </div>
        </nav>
    </div>
    )
}

export default Navbar