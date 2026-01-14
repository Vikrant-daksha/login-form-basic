import { Link } from "react-router-dom";
import React, { useState } from "react";
import api from "../api/axiosinstance";

export function Product() {
    
    const [product, setProduct] = useState('')
    const [price, setPrice] = useState('')
    const [productList, setProductList] = useState('')
    
    
    
    async function submit(e) {
        
        e.preventDefault()
        
        
        const priceNum = parseInt(price)
        
        try{
            if (!product || !price){
                alert("Cannot be Empty")
            } else {

            const res = await api.post("/product",{
                product,
                price: priceNum
            }).then(async res => {
                if(res){
                    const { message } = res.data
                    alert(message)
                    console.log(productList)
                } else {
                    alert('E')
                }
            }).catch(e => {
                console.log(e)
            })
            }
            
        } catch (e) {
            alert(e)
        }
        
    }

    return(
        <>
            <div className="no-select-global  flex items-center justify-center min-h-screen">
                <div className="flex items-center justify-center flex-col mt-28 mb-28">
                    <div className="border min-w-md p-6 min-h-2/4 rounded-2xl">
                        <div className="flex items-center justify-center text-7xl mb-2.5">
                            Product
                        </div>
                        <div className="mb-6">
                            <p className="flex items-center justify-center font-semibold text-2xl mb-1.5">Welcome Back</p>
                            <p className="flex items-center justify-center text-sm text-gray-700">Please enter your account details to login.</p>
                        </div>
                        <form>
                            <div className="flex justify-between mb-7">
                                <button className="px-13 py-2 border border-gray-300 rounded-md text-xl">A</button>
                                <button className="px-13 py-2 border border-gray-300 rounded-md text-lg">G</button>
                                <button className="px-13 py-2 border border-gray-300 rounded-md text-lg">T</button>
                            </div>
                            <div className="flex justify-between items-center mb-5 max-h-1">
                                <div className="border-b min-w-2/5 border-gray-300"></div>
                                <div className="text-gray-500 text-xs">OR</div>
                                <div className="border-b min-w-2/5 border-gray-300"></div>
                            </div>
                            <div className="flex justify-center flex-col relative">
                                <label className="font-semibold mb-1">
                                    Username
                                </label>
                                <input type="text" className="border border-gray-300 p-2 pl-3 rounded-lg" onChange={(e) => {setProduct(e.target.value)}} placeholder="Enter your username..." name = "product" id = "product" value={product}></input>
                                <label className="font-semibold mb-1 mt-3">
                                    Password
                                </label>
                                <input type="text" className="border border-gray-300 p-2 pl-3 rounded-lg flex items-center justify-center" onChange = {(e)=> {setPrice(e.target.value)}} placeholder="• • • • • • • • • •" name = "price" id = "price" value={price}></input>
                            </div>
                            <div className="mt-4 flex justify-between items-center mb-5">
                                <div>
                                    <label className="ml-0.5 font-semibold">
                                        <input type="checkbox" className="mr-1.5 accent-blue-500"></input>
                                        Remember me
                                    </label>
                                </div>
                                <div>
                                    <label className="font-extralight border-b-2">
                                        Forgot Password ?
                                    </label>
                                </div>
                            </div>
                            <div className="min-w-full min-h-11">
                                <button className="border rounded-lg min-h-11 min-w-full bg-black text-white font-semibold" onClick = {submit}>Login</button>
                            </div>
                            <div className="mt-4.5 flex items-center justify-center">
                                <p className="justify-between">Don't have an account yet? <Link to="/signin" className="font-semibold"> Sign Up</Link></p> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}