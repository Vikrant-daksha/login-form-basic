import React from "react"
import { useState } from "react";
import '../App.css'
import { LiaSignInAltSolid } from "react-icons/lia";
import { FaGoogle, FaApple } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosinstance.ts";
import { useAuth } from "../context/Authcontext";

export function Login(){

    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showPass, setShowPass] = useState(false)

    const { setUser } = useAuth() 

    const passToggle = () => {
        setShowPass(prev => !prev)
    };
    
    async function submit(e) {
        e.preventDefault();
        
        try{
            if(!username || !password){
                alert("Username / Password cannot be Empty");
                return;
            }
            
            const res = await api.post("/login",{
                username,
                password
            })

            
            if(!res || !res.data) {
                alert("Server Error");
                return;
            }
            
            const { success, message, token, username: validuser } = res.data
            
            if (success){
                
                if ( token ) {
                    localStorage.setItem("token", token);
                    setUser({token})
                }
                try {
                    const res = await api.get("/auth", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } catch (err) {
                    console.error(err);
                    alert("You are not authorized");
                }
                alert(message)
                navigate("/")
                
            } else {
                alert(message || "Login Failed.")
            }
            
        } catch (e) {
            console.log(e)
        }
    }
    
    return(
        <>
            <div className="no-select-global">
                <div className="flex items-center justify-center flex-col mt-28 mb-28">
                    <div className="border min-w-80 p-6 rounded-2xl md:min-w-96">
                        <div className="flex items-center justify-center text-7xl mb-2.5">
                            <LiaSignInAltSolid />
                        </div>
                        <div className="mb-6">
                            <p className="flex items-center justify-center font-semibold text-2xl mb-1.5">Welcome Back</p>
                            <p className="flex items-center justify-center text-sm text-gray-700">Please enter your account details to login.</p>
                        </div>
                        <div className="flex justify-evenly mb-7">
                            <button className="px-3 sm:px-8 py-2 border border-gray-300 rounded-md text-xl"><FaApple /></button>
                            <button className="px-3 sm:px-8 py-2 border border-gray-300 rounded-md text-lg"><FaGoogle /></button>
                            <button className="px-3 sm:px-8 py-2 border border-gray-300 rounded-md text-lg"><FaXTwitter /></button>
                        </div>
                        <form onSubmit={submit}>
                            <div className="flex justify-between items-center mb-5 max-h-1">
                                <div className="border-b min-w-2/5 border-gray-300"></div>
                                <div className="text-gray-500 text-xs">OR</div>
                                <div className="border-b min-w-2/5 border-gray-300"></div>
                            </div>
                            <div className="flex justify-center flex-col relative">
                                <label className="font-semibold mb-1">
                                    Username
                                </label>
                                <input type="text" className="border border-gray-300 p-2 pl-3 rounded-lg" onChange={(e) => {setUsername(e.target.value)}} placeholder="Enter your username..." name = "username" id = "user" value={username}></input>
                                <label className="font-semibold mb-1 mt-3">
                                    Password
                                </label>
                                <input type={showPass ? 'text' : 'password'} className="border border-gray-300 p-2 pl-3 rounded-lg flex items-center justify-center" onChange = {(e)=> {setPassword(e.target.value)}} placeholder="• • • • • • • • • •" name = "password" id = "pass" value={password}></input>
                                <span className="absolute bottom-3 right-4" onClick={passToggle}>
                                    {showPass ? < LuEye /> : < LuEyeClosed />}
                                </span>
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
