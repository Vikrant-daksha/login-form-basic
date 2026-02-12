import React from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/Authcontext"


export function Account(){

    const location = useLocation()

    const { user, logout } = useAuth();

    if(user){
        
    }

    return(
        <>
            <div>
                <p>Welcome  This is Home Page</p>
            </div>
        </>
    )
}