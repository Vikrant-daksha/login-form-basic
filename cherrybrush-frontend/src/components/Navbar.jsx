import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import "../App.css";
import { useAuth } from "../context/Authcontext.jsx";
import { User2 } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import {
  LuHistory,
  LuLogOut,
  LuPackage,
  LuClipboardList,
  LuUsersRound,
} from "react-icons/lu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountOverlay, setAccountOverlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  useEffect(() => {
    setAccountOverlay(false);
    setIsOpen(false);
  }, [location]);

  const handleRedirect = async (link) => {
    navigate(`${link}`);
    setAccountOverlay(false);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setAccountOverlay(false);
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        {/* New Minimalist Navbar */}
        <nav className="bg-black/95 backdrop-blur-md border-b border-white/10 px-6 md:px-12 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src="/logo.gif" alt="Logo" className="h-8 md:h-10 brightness-110" />
                <span className="ml-3 text-white font-semibold tracking-[0.3em] uppercase hidden md:inline text-sm">Websell</span>
              </Link>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden lg:flex items-center gap-10">
              <Link to="/catalog" className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] hover:text-white transition-colors relative group">
                Browse
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/gallery" className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] hover:text-white transition-colors relative group">
                Product Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Right: Icons & Actions */}
            <div className="flex items-center gap-6">
              <Link to="/cart" className="text-white hover:text-gray-400 transition-colors relative">
                <FaCartShopping size={18} />
                {/* Optional cart badge could go here */}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountOverlay(!accountOverlay)}
                    className="flex items-center gap-2 group"
                  >
                    <div className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-white transition-all">
                      <User2 size={16} />
                    </div>
                  </button>

                  {/* Enhanced Dropdown */}
                  {accountOverlay && (
                    <div className="absolute right-0 mt-4 w-72 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 overflow-hidden text-sm slide-in-top">
                      {/* User Info Header */}
                      <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 mb-2 flex justify-between">
                        <div>
                          <p className="font-bold text-black uppercase tracking-widest text-xs">{user.username}</p>
                          <p className="text-gray-500 text-[11px] truncate mt-1">{user.email || user.phone_no}</p>
                        </div>
                        <div className="flex items-center w-fit h-fit px-3 py-2.5 bg-black text-white text-[9px] uppercase tracking-tighter rounded-md">
                          {user.role}
                        </div>
                      </div>

                      {/* Store Management (Admins) */}
                      {user.role === "admin" && (
                        <div className="px-2 py-1">
                          <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Studio Management</p>
                          <DropdownItem icon={<LuPackage />} label="Add Product" onClick={() => handleRedirect("/product")} />
                          <DropdownItem icon={<LuClipboardList />} label="All Orders" onClick={() => handleRedirect("/admin/orders")} />
                          <DropdownItem icon={<LuUsersRound />} label="User Base" onClick={() => handleRedirect("/users")} />
                          <DropdownItem icon={<MdDiscount />} label="Promotions" onClick={() => handleRedirect("/discount")} />
                        </div>
                      )}

                      {/* Creator Options */}
                      {(user.role === "admin" || user.role === "creator") && (
                        <div className="px-2 py-1 border-t border-gray-50">
                          <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Creator Options</p>
                          <DropdownItem icon={<GiMoneyStack />} label="Commissions" onClick={() => handleRedirect("/comissions")} />
                        </div>
                      )}

                      {/* General Account */}
                      <div className="px-2 py-1 border-t border-gray-50">
                        <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Settings</p>
                        <DropdownItem icon={<User2 size={16} />} label="My Account" onClick={() => handleRedirect("/account")} />
                        <DropdownItem icon={<LuHistory />} label="Order History" onClick={() => handleRedirect("/order-history")} />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-lg font-medium"
                        >
                          <LuLogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-[11px] font-bold text-white uppercase tracking-[0.2em] border border-white/30 px-5 py-2 hover:bg-white hover:text-black transition-all">
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden text-white"
              >
                <GiHamburgerMenu size={24} />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b">
                <span className="font-bold tracking-widest uppercase text-sm">Menu</span>
                <button onClick={() => setIsOpen(false)}><IoClose size={28} /></button>
              </div>

              <div className="p-8 space-y-8 flex-grow">
                <MobileNavItem label="Browse Products" to="/catalog" onClick={() => setIsOpen(false)} />
                <MobileNavItem label="Inspiration Gallery" to="/gallery" onClick={() => setIsOpen(false)} />
                <MobileNavItem label="Latest Arrivals" to="/catalog?category=new" onClick={() => setIsOpen(false)} />
              </div>

              {user && (
                <div className="p-8 border-t bg-gray-50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white italic font-serif">
                      {user.username.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-widest text-xs">{user.username}</p>
                      <button onClick={handleLogout} className="text-red-500 text-[10px] uppercase font-bold tracking-tighter mt-1">Logout Account</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legacy Navbar (Commented Out)
      <div className="sticky top-0 z-10 w-full leading-none">
        <nav className="py-1.5 bg-black">
          <div className="flex items-center min-h-14 justify-center-safe">
            <div className="text-2xl px-8">
              <Link to="/" className="font-bold">
                <img src="/logo.gif" alt="Cherrybrush" className="h-10" />
              </Link>
            </div>
            <div className="hidden text-gray-200 m-1.5 sm:flex">
              <div
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
                <Link to="/catalog">Browse Products</Link>
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
          </div>
        </nav>
      </div>    
      */}
    </>
  );
}

// Helper Components for the new design
function DropdownItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors rounded-lg group"
    >
      <span className="text-gray-400 group-hover:text-black transition-colors">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function MobileNavItem({ label, to, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-2xl font-bold uppercase tracking-tighter text-black hover:text-gray-500 transition-colors"
    >
      {label}
    </Link>
  );
}
