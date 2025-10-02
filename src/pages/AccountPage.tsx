import React from "react"
import { useLocation } from "react-router-dom"


export function Account(){

    const location = useLocation()

    return(
        <>
            <div>
                <p>Welcome {location.state.id } This is Home Page</p>
            </div>
        </>
    )
}