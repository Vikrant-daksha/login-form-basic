import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiaSignInAltSolid } from "react-icons/lia";
import { FaGoogle, FaApple } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"
import { LuEye, LuEyeClosed } from "react-icons/lu";
import axios from "axios";


export function Signin(){

    const history = useNavigate()

    const [username, setUsername] = useState('');
    const [passCheck, setPassCheck] = useState('')
    const [password, setPassword] = useState('');

    const [showPass, setShowPass] = useState(false)

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

            await axios.post("http://localhost:5000/signin",{
                username,password
            }).then(res => {
                if(res.data === "exist"){
                    alert("User Already Exist")
                }
                else if(res.data === "notexist"){
                    history("/home", {state:{id:username}})
                }
            })
            .catch( e => {
                alert("wrong details")
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }

    return(
        <>
            <div className="no-select-global flex items-center justify-center min-h-screen">
                <div className="flex items-center justify-center flex-col mt-28 mb-28">
                    <div className="border min-w-md p-6 min-h-2/4 rounded-2xl">
                        <div className="flex items-center justify-center text-7xl mb-2.5">
                            <LiaSignInAltSolid />
                        </div>
                        <div className="mb-6">
                            <p className="flex items-center justify-center font-semibold text-2xl mb-1.5">Siging In</p>
                            <p className="flex items-center justify-center text-sm text-gray-700">Please enter your details to sign in.</p>
                        </div>
                        <form>
                            <div className="flex justify-between mb-7">
                                <button className="px-13 py-2 border border-gray-300 rounded-md text-xl"><FaApple /></button>
                                <button className="px-13 py-2 border border-gray-300 rounded-md text-lg"><FaGoogle /></button>
                                <button className="px-13 py-2 border border-gray-300 rounded-md text-lg"><FaXTwitter /></button>
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
                                <button className="border rounded-lg min-h-11 min-w-full bg-black text-white font-semibold hover:" onClick = {submit}>Sign In</button>
                            </div>
                            <div className="mt-4.5 flex items-center justify-center">
                                <p className="justify-between">Already have an account? <Link to="/login" className="font-semibold">Login</Link></p> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}