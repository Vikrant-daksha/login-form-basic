import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import "../App.css";
import { useAuth } from "../context/Authcontext.jsx";
import { User2 } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import {
  LuHistory,
  LuLogOut,
  LuPackage,
  LuClipboardList,
} from "react-icons/lu";
import api from "../api/axiosinstance.jsx";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountOverlay, setAccountOverlay] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleRedirect = async (link) => {
    navigate(`${link}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="sticky top-0 z-10 w-full leading-none">
        <nav className="py-1.5 bg-black">
          <div className="flex items-center justify-between min-h-14 lg:justify-evenly">
            <div className="text-2xl px-8">
              <Link to="/" className="font-bold">
                <img src="/logo.gif" alt="Cherrybrush" className="h-10" />
              </Link>
            </div>
            <div className="hidden justify-between text-gray-200 align-middle m-1.5 sm:flex">
              <ul className="flex flex-wrap mr-3">
                <li
                  className="px-2.5 py-2 relative
  after:content-['']
  after:absolute
  after:left-0
  after:bottom-0
  after:h-[2px]
  after:w-0
  after:bg-current
  after:transition-all
  after:duration-300
  hover:after:w-full"
                >
                  <Link to="/catalog">Press On Nails</Link>
                </li>
                <li
                  className="px-2.5 py-2 relative
  after:content-['']
  after:absolute
  after:left-0
  after:bottom-0
  after:h-[2px]
  after:w-0
  after:bg-current
  after:transition-all
  after:duration-300
  hover:after:w-full"
                >
                  Custom Press Ons
                </li>
                <li
                  className="px-2.5 py-2 relative
  after:content-['']
  after:absolute
  after:left-0
  after:bottom-0
  after:h-[2px]
  after:w-0
  after:bg-current
  after:transition-all
  after:duration-300
  hover:after:w-full"
                >
                  Nail Polish
                </li>
                <li
                  className="px-2.5 py-2 relative
  after:content-['']
  after:absolute
  after:left-0
  after:bottom-0
  after:h-[2px]
  after:w-0
  after:bg-current
  after:transition-all
  after:duration-300
  hover:after:w-full"
                >
                  Nail Care
                </li>
              </ul>
              <div className="flex align-middle flex-wrap">
                <button className="border border-white px-3.5">
                  Book A Manicure
                </button>
              </div>
            </div>
            <div className="hidden text-gray-200 sm:flex pr-7">
              <div className="flex items-center px-5 text-xl">
                <Link to="/cart" className="flex items-center">
                  <FaCartShopping></FaCartShopping>
                </Link>
              </div>
              {user ? (
                <>
                  <button
                    onClick={() => {
                      accountOverlay
                        ? setAccountOverlay(false)
                        : setAccountOverlay(true);
                    }}
                    className="relative inline-flex items-center"
                  >
                    <div className="p-0.5 border border-gray-200 rounded-full mr-2">
                      <User2 />
                    </div>
                  </button>
                  <div className="relative text-black">
                    {accountOverlay && (
                      <div className="absolute border border-black rounded-lg top-10 right-0 bg-background flex justify-center items-center">
                        <div className="w-3xs mx-2">
                          <div className="my-5 h-20 flex flex-col justify-center items-center">
                            <div className="p-2 border border-black rounded-full">
                              <User2 />
                            </div>
                            <div className="my-2 font-bold">
                              {user?.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user?.email || user?.phone_no || ""}
                            </div>
                          </div>
                          <div className="flex justify-start items-center hover:bg-secondary rounded-full">
                            <button
                              className="w-full px-3 py-3 flex justify-start items-center text-[1rem] hover:bg-gray-300 rounded-full"
                              onClick={() => {
                                handleRedirect("/account");
                                setAccountOverlay(false);
                              }}
                            >
                              <User2 className="h-5 mr-2" />
                              Account
                            </button>
                          </div>
                          <div className="flex justify-start items-center rounded-full my-1">
                            <button
                              className="w-full px-3 py-3 flex justify-start items-center text-[1rem] hover:bg-gray-300 rounded-full"
                              onClick={() => {
                                handleRedirect("/cart");
                                setAccountOverlay(false);
                              }}
                            >
                              <FaCartShopping className="h-5 mr-4" />
                              Cart
                            </button>
                          </div>
                          <div className="flex justify-start items-center hover:bg-gray-300 rounded-full">
                            <button
                              className="w-full px-3 py-3 flex justify-start items-center text-[1rem] hover:bg-gray-300 rounded-full"
                              onClick={() => {
                                handleRedirect("/order-history");
                                setAccountOverlay(false);
                              }}
                            >
                              <LuHistory className="h-5 mr-3" />
                              Order History
                            </button>
                          </div>
                          {user?.role === "admin" && (
                            <>
                              <div className="flex justify-start items-center hover:bg-gray-300 rounded-full">
                                <button
                                  className="w-full px-3 py-3 flex justify-start items-center text-[1rem] hover:bg-gray-300 rounded-full"
                                  onClick={() => {
                                    handleRedirect("/product");
                                    setAccountOverlay(false);
                                  }}
                                >
                                  <LuPackage className="h-5 mr-3" />
                                  Add Product
                                </button>
                              </div>
                              <div className="flex justify-start items-center hover:bg-gray-300 rounded-full">
                                <button
                                  className="w-full px-3 py-3 flex justify-start items-center text-[1rem] hover:bg-gray-300 rounded-full"
                                  onClick={() => {
                                    handleRedirect("/admin/orders");
                                    setAccountOverlay(false);
                                  }}
                                >
                                  <LuClipboardList className="h-5 mr-3" />
                                  All Orders
                                </button>
                              </div>
                            </>
                          )}
                          <div className="flex justify-start items-center rounded-full my-4 ">
                            <button
                              className="w-full px-3 py-3 flex justify-center border hover:text-secondary border-white items-center hover:bg-primary text-[1rem] hover:cursor-pointer bg-secondary text-primary rounded-full transition-all ease-in-out"
                              onClick={() => {
                                handleLogout();
                                setAccountOverlay(false);
                              }}
                            >
                              <LuLogOut className="h-5 mr-3" />
                              Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className="text-lg px-5">
                  Login
                </Link>
              )}
            </div>
            <div className="flex items-center">
              <Link to="/cart" className="sm:hidden mr-4 text-xl">
                <FaCartShopping className="text-white" />
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="sm:hidden mr-4 text-2xl p-1.5"
              >
                <GiHamburgerMenu className="text-white" />
              </button>
            </div>
          </div>
          <div
            className={`${
              isOpen ? "translate-x-0" : "translate-x-full"
            } min-h-dvh w-full fixed top-0 right-0 font-extralight z-50`}
          >
            <div
              id="slide"
              className=" flex min-h-dvh flex-col sm:hidden bg-gray-200 "
            >
              <div className="w-full text-end my-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="mr-4 text-3xl"
                >
                  <IoClose />
                </button>
              </div>
              <button className="border border-white py-2 mx-4 mb-1">
                Book A Manicure
              </button>
              <ul className="">
                <li className="px-5 py-2.5 border-b border-white">
                  <Link
                    to="/catalog"
                    onClick={() => setIsOpen(false)}
                    className="block w-full"
                  >
                    Press On Nails
                  </Link>
                </li>
                <li className="px-5 py-2.5 border-b border-white">Custom</li>
                <li className="px-5 py-2.5 border-b border-white">
                  Nail Polish
                </li>
                <li className="px-5 py-2.5 border-b border-white">Nail Care</li>
              </ul>
              {user ? (
                <>
                  <div>
                    <button
                      onClick={() => {
                        accountOverlay
                          ? setAccountOverlay(false)
                          : setAccountOverlay(true);
                      }}
                      className="w-full flex items-center py-2.5 px-5 border-b border-white"
                    >
                      <User2 className="mr-2 p-0.5 border border-black rounded-full" />
                      {user?.username || "Account"}
                    </button>
                  </div>
                  <div className="mb-4">
                    {accountOverlay && (
                      <div className="ml-6 bg-gray-300">
                        <button
                          onClick={() => {
                            handleRedirect("/account");
                            setAccountOverlay(false);
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center py-2.5 px-5 border-b border-white hover:bg-gray-400"
                        >
                          <User2 className="mr-2 p-0.5 h-5 w-5" />
                          Account
                        </button>
                        <button
                          onClick={() => {
                            handleRedirect("/cart");
                            setAccountOverlay(false);
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center py-2.5 px-5 border-b border-white hover:bg-gray-400"
                        >
                          <FaCartShopping className="mr-2 p-0.5 h-5 w-5" />
                          Cart
                        </button>
                        <button
                          onClick={() => {
                            handleRedirect("/order-history");
                            setAccountOverlay(false);
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center py-2.5 px-5 border-b border-white hover:bg-gray-400"
                        >
                          <LuHistory className="mr-2 p-0.5 h-5 w-5" />
                          Order History
                        </button>
                        {user?.role === "admin" && (
                          <>
                            <button
                              onClick={() => {
                                handleRedirect("/product");
                                setAccountOverlay(false);
                                setIsOpen(false);
                              }}
                              className="w-full flex items-center py-2.5 px-5 border-b border-white hover:bg-gray-400"
                            >
                              <LuPackage className="mr-2 p-0.5 h-5 w-5" />
                              Add Product
                            </button>
                            <button
                              onClick={() => {
                                handleRedirect("/admin/orders");
                                setAccountOverlay(false);
                                setIsOpen(false);
                              }}
                              className="w-full flex items-center py-2.5 px-5 border-b border-white hover:bg-gray-400"
                            >
                              <LuClipboardList className="mr-2 p-0.5 h-5 w-5" />
                              All Orders
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-start px-4">
                    <button
                      onClick={() => handleLogout()}
                      className="flex justify-center items-center-safe text-lg font-light text-12 px-2.5 py-0.5 rounded-xl bg-red-500 text-white"
                    >
                      <LuLogOut className="mr-1" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-sm text-left py-1.5 px-5 mt-3"
                >
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full h-full text-left"
                  >
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
