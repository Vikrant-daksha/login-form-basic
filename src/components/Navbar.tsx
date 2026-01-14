import { useState } from "react"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoClose } from "react-icons/io5"
import '../App.css'
import { useAuth } from "../context/Authcontext.tsx"
import { User2 } from "lucide-react"
import { FaCartShopping } from "react-icons/fa6"

export function Navbar(){

    const [isOpen, setIsOpen] = useState(false)

    const { user, logout } = useAuth()

    const navigate = useNavigate()

    const underLineAnimation = `relative
  after:content-['']
  after:absolute
  after:left-0
  after:bottom-0
  after:h-[2px]
  after:w-0
  after:bg-current
  after:transition-all
  after:duration-300
  hover:after:w-full`
    
    const handleLogout = () => {
        logout()
        navigate("/login")
    } 
    

    return(
    <div className="sticky top-0 z-10 w-full leading-none">
        <nav className="py-1.5 bg-amber-300">
            <div className="flex items-center justify-between min-h-14 lg:justify-evenly">
            <div className="text-2xl px-8">
                <a href='/' className="font-bold">Logo</a>
            </div>
            <div className="hidden justify-between align-middle m-1.5 sm:flex">
                <ul className="flex flex-wrap mr-3">    
                    <li className="px-2.5 py-2 relative
  after:content-['']
  after:absolute
  after:left-0
  after:bottom-0
  after:h-[2px]
  after:w-0
  after:bg-current
  after:transition-all
  after:duration-300
  hover:after:w-full">Press On Nails</li>
                    <li className="px-2.5 py-2 relative
  after:content-['']
  after:absolute
  after:left-0
  after:bottom-0
  after:h-[2px]
  after:w-0
  after:bg-current
  after:transition-all
  after:duration-300
  hover:after:w-full">Custom Press Ons</li>
                    <li className="px-2.5 py-2 relative
  after:content-['']
  after:absolute
  after:left-0
  after:bottom-0
  after:h-[2px]
  after:w-0
  after:bg-current
  after:transition-all
  after:duration-300
  hover:after:w-full">Nail Polish</li>
                    <li className="px-2.5 py-2 relative
  after:content-['']
  after:absolute
  after:left-0
  after:bottom-0
  after:h-[2px]
  after:w-0
  after:bg-current
  after:transition-all
  after:duration-300
  hover:after:w-full">Nail Care</li>
                </ul>
                <div className="flex align-middle flex-wrap">
                    <button className="border border-white px-3.5">Book A Manicure</button>
                </div>
            </div>
            <div className="hidden sm:flex pr-7">
                <div className="flex items-center px-5 text-xl">
                    <Link to="/services" className="flex items-center"><FaCartShopping></FaCartShopping></Link>
                </div>
                
                {user ? (
                    <>
                    <div><Link to="/account" className="text-lg px-5">Account</Link></div>
                    <div className="inline-flex items-center">
                        <Link to="/account" className="mr-0.5 p-0.5 border rounded-full"><User2/></Link>
                        <button onClick={handleLogout} className="font-bold text-12 px-2.5 py-0.5 rounded-xl bg-red-500 text-white">Logout</button>
                    </div>
                    </>
                ) : (
                    <Link to="/login" className="text-lg px-5">Login</Link>
                )}
            </div>
                <button onClick={() => setIsOpen(!isOpen)} className="sm:hidden mr-4 text-2xl p-1.5"><GiHamburgerMenu /></button>
            </div>
            <div className={`${
            isOpen ? "translate-x-0" : "translate-x-full"
            } min-h-dvh w-full fixed top-0 right-0 font-extralight z-50`}>
            <div id="slide" className=" flex min-h-dvh flex-col sm:hidden bg-gray-200 ">
            <div className="w-full text-end my-2">
                <button onClick={() => setIsOpen(!isOpen)} className="mr-4 text-3xl"><IoClose /></button>
            </div>
            <button className="border border-white py-2 mx-4 mb-1">Book A Manicure</button>
                <ul className="">    
                    <li className="px-5 py-2.5 border-b border-white">Press On Nails</li>
                    <li className="px-5 py-2.5 border-b border-white">Custom</li>
                    <li className="px-5 py-2.5 border-b border-white">Nail Polish</li>
                    <li className="px-5 py-2.5 border-b border-white">Nail Care</li>
                </ul>
                {user ? (
                    <>
                    <div><Link to="/account" className="block text-xl py-1.5 px-5 border-b-1">Account</Link></div>
                    <div className="flex justify-center pb-2">
                        <Link to="/account" className="mr-0.5 p-0.5 border rounded-full"><User2/></Link>
                        <button onClick={handleLogout} className="text-xs font-bold text-12 px-2.5 py-0.5 rounded-xl bg-red-500 text-white">Logout</button>
                    </div>
                    </>
                ) : (
                    <Link to="/login" className="block text-sm py-1.5 px-5 mt-3">Login</Link>
                )} 
            </div>
            </div>
        </nav>
    </div>
    )
}