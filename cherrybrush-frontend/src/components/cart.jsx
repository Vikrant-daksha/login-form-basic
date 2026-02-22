import { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext.jsx"
import api from "../api/axiosinstance.jsx";
import { TbShoppingCartCancel, TbTrash } from "react-icons/tb";
import { IconContext } from "react-icons";
import { FaFolder } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"

function Cart() {

    const [cart, setCart] = useState([]);
    const [subTotal, setSubTotal] = useState(null);
    const [deliveryCost, setDeliveryCost] = useState(40)

    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const fetchCart = async() => {
            try{
                const res = await api.get("/api/auth/cart")
                if (!res) {
                    console.log("Error fetching Cart");
                    return;
                }
                setCart(res.data);
                console.log(res.data)
    
            } catch (err) {
                console.log("Error Adding to cart", err)
            }
        }

        fetchCart();
    },[user])

    useEffect(() => {
        const total = 0;
        let cartTotal = 0;

        const addPrice = async() => {
            if(cart) {
                {cart.map(f => cartTotal += parseFloat(f.price * f.quantity))}
            }            
        }
        
        addPrice();
        
        setSubTotal(cartTotal)
    }, [cart])

    useEffect(() => {
        console.log(subTotal)
    }, [subTotal])
    
    if (cart.length == 0) {
        return(
            <div className="h-[55vh] bg-gray-50">
                <div id="cart-items" className="h-full w-full flex justify-center items-center">
                    <div id="cart-placeholder" className="flex flex-col justify-center items-center ">
                        <div className="react-icon mb-1.5">
                            <IconContext.Provider value={{ size: "3rem", color: "gray", className: "stroke-2" }}>
                            <div>
                                <TbShoppingCartCancel />
                            </div>
                            </IconContext.Provider>
                        </div>
                        <div className="text-[14px] text-[#808080] uppercase pb-6">Cart is Empty, Fill with Care</div>
                        <div>
                            <Link to={"/catalog"}><button className="text-[12px] rounded-[5px] px-4 py-2.5 bg-pink-100">Continue Shopping</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    return(
        <div className="h-[99999px]">
            <div className="grid gap-4 my-9">
                {cart?.map((elem) => (
                <div key={elem.product_id} className="mx-10">
                    <div className="grid grid-cols-4 items-center px-1 py-1 w-full border border-solid rounded-xl">
                        <div className="flex items-center">
                            <div className="rounded-xl p-0.5 border mr-3">
                                <img src={elem?.images?.[0].replace("/upload", "/upload/w_80,h_80,c_fill/") || logo} width={80} height={80} className="rounded-lg"></img>
                            </div> 
                            <span>{elem?.product}</span>
                        </div>
                        <div className="text-center">
                            <span>{elem?.quantity}</span>
                        </div>
                        <div className="m-auto">
                            <TbTrash/>
                        </div>
                        <div className="text-center">
                            <span>{parseFloat(elem?.price * elem?.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                </div>))}
            </div>
                <div className="flex w-full">
                    <div id="SubTotal" className="flex justify-between">
                        <div className="flex">SubTotal</div>
                        <div className="flex">{parseFloat(subTotal).toFixed(2)}</div>
                    </div>
                </div>
            <div className="flex w-full">
                <div className="flex flex-col">
                    <span>Subtotal:</span>
                    <span>Delivery:</span>
                    <div className="divider"></div>
                    <span>Total</span>
                </div>
                <div className="flex flex-col">
                    <span>{parseFloat(subTotal).toFixed(2)}</span>
                    <span>{deliveryCost}</span>
                    <div className="divider"></div>
                    <span>{parseFloat(subTotal + deliveryCost).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

export default Cart;