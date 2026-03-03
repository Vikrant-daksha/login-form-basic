import React, { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/Authcontext"
import api from "../api/axiosinstance";
import { LuLogOut } from "react-icons/lu";


export function Account(){

    const location = useLocation()

    const [userProfile, setUserProfile] = useState([])
    
    const { user, logout } = useAuth();
    
    useEffect(() => {
        if(!user) return;
    
        const fetchUserProfile = async () => {
            try{
                const res = await api.get("/api/profile");
                if (!res) {
                    console.log("Error fetching Account");
                    return;
                }
                setUserProfile(res.data);
            } catch (err) {
                console.log("Error Getting User Profile", err)
            }
        };
    
        fetchUserProfile();
    
    }, [user]);

    function handleLogout() {
        logout();
        Navigate("/")
    }

    const [nouse, setNoUse] = useState('')

    const handleUpdate = async() => {
        try{
            console.log("Updated to:", nouse)
            // const res = await api.put("/api/client/update", { email: nouse });
            // if (!res) {
            //     console.log("Error fetching Account");
            //     return;
            // }
            // setUserProfile(res.data);
        } catch (err) {
            console.log("Error Getting User Profile", err)
        }
    }
    
    const { username, email, phone_no } = userProfile;
    
    return(
        <>
            <div>
                <p>Welcome  This is Home Page</p>
            </div>
                <div>
                    
                    <p>Username: {username} </p> <div><input type="text" onChange={(e) =>{setNoUse(e.target.value)}}></input></div><button onClick={handleUpdate} className="bg-amber-700">update</button>
                    <p>Email:{email}</p>
                    <p>Phone Number:{phone_no}</p>
                    <p>Password: • • • • • •</p>
                    <button onClick={handleLogout} className="flex justify-between items-center font-light px-2.5 py-2 rounded-lg bg-red-500 text-white"><LuLogOut className="stroke-2 mr-2"/> Logout</button>
                </div>
        </>
    )
}