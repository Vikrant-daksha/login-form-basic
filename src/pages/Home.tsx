import React from "react";
import { useLocation } from "react-router-dom";

export function Home(){

    const Location = useLocation()

    return(
        <>
            <div className="flex items-center justify-center min-w-screen min-h-screen">
                <p className="flex items-center justify-center min-w-screen min-h-screen">Hi {Location.state.id}</p>
            </div>
        </>
    )
}