import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiaSignInAltSolid } from "react-icons/lia";
import { FaGoogle, FaApple } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"
import { LuEye, LuEyeClosed } from "react-icons/lu";
import api from "../api/axiosinstance";
import { useAuth } from "../context/Authcontext";


export function Register(){

    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [passCheck, setPassCheck] = useState('')
    const [password, setPassword] = useState('');
    
    const [showPass, setShowPass] = useState(false)
    const { login } = useAuth()
    
    const passToggle = () => {
        setShowPass(prev => !prev)
    };

    async function submit(e) {
        e.preventDefault();

        try{
            
            if (!username || !password) {
                alert("Username and password cannot be empty.");
                return
            }
            
            if (passCheck !== password) {
                alert("Passwords do not match.")
                return
            }

            const trimUsername = username.trim(); 
            
            let userData = {};
            if(!isNaN(trimUsername)) {
                userData = { email: null, phone_no: trimUsername, password: password };
            }

            else if(trimUsername.includes("@")) {
                userData = { email: trimUsername, phone_no: null, password: password };
            }
            else {
                alert("Entered Value id neither mail nor Phone No");
                return;
            }
            const res = await api.post("api/auth/register", userData);
            if (res.data) {
                await login(res.data);
                navigate("/");
            } else {
                console.error("Could Not Register")
            }
            
        } catch (e) {
            console.log(e)
        }
    }

    return(
        <>
            <div className="no-select-global">
                <div className="flex items-center justify-center flex-col mt-28 mb-28">
                    <div className="border min-w-96 p-6 rounded-2xl">
                        <div className="flex items-center justify-center text-7xl mb-2.5">
                            <LiaSignInAltSolid />
                        </div>
                        <div className="mb-6">
                            <p className="flex items-center justify-center font-semibold text-2xl mb-1.5">Register</p>
                            <p className="flex items-center justify-center text-sm text-gray-700">Please enter your details to sign in.</p>
                        </div>
                        <form onSubmit={submit}>
                            <div className="flex justify-evenly mb-7">
                                <button className="px-3 sm:px-8 py-2 border border-gray-300 rounded-md text-xl"><FaApple /></button>
                                <button className="px-3 sm:px-8 py-2 border border-gray-300 rounded-md text-lg"><FaGoogle /></button>
                                <button className="px-3 sm:px-8 py-2 border border-gray-300 rounded-md text-lg"><FaXTwitter /></button>
                            </div>
                            <div className="flex justify-between items-center mb-5 max-h-1">
                                <div className="border-b min-w-2/5 border-gray-300"></div>
                                <div className="text-gray-500 text-xs">OR</div>
                                <div className="border-b min-w-2/5 border-gray-300"></div>
                            </div>
                            <div className="flex justify-center flex-col relative mb-8">
                                <label className="font-semibold mb-1">
                                    Username
                                </label>
                                <input type="text" className="border border-gray-300 p-2 pl-3 rounded-lg" onChange={(e) => {setUsername(e.target.value)}} placeholder="Enter username..." name = "" id = "user" value={username}></input>
                                <label className="font-semibold mb-1 mt-3">
                                    Password
                                </label>
                                <input type={showPass ? 'text' : 'password' } className="border border-gray-300 p-2 pl-3 rounded-lg flex items-center justify-center" onChange = {(e)=> {setPassword(e.target.value)}} placeholder="• • • • • • • • • •" name = "" id = "pass" value={password}></input>
                                <span className="absolute top-31 right-4" onClick={passToggle}>
                                    {showPass ? < LuEye /> : < LuEyeClosed />}
                                </span>
                                <label className="font-semibold mb-1 mt-3">
                                    Confirm Password
                                </label>
                                <input type={showPass ? 'text' : 'password' } className="border border-gray-300 p-2 pl-3 rounded-lg flex items-center justify-center" onChange = {(e)=> {setPassCheck(e.target.value)}} placeholder="• • • • • • • • • •" name = "" id = "passcheck" value={passCheck}></input>
                                <span className="absolute bottom-3 right-4" onClick={passToggle}>
                                    {showPass ? < LuEye /> : < LuEyeClosed />}
                                </span>
                            </div>
                            <div className="min-w-full min-h-11">
                                <button className="border rounded-lg min-h-11 min-w-full bg-black text-white font-semibold" onClick = {submit}>Register</button>
                            </div>
                            <div className="mt-4.5 flex items-center justify-center">
                                <p className="justify-between">Already have an account? <Link to="/login" className="font-semibold hover:border-b-2 hover:border-black">Login</Link></p> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}