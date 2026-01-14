import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Banner from "./components/Banner";
import { Footer } from "./components/Footer";

export function Layout() {

    return(
        <>
        <Banner/>
        <Navbar/>
        <main>
            <Outlet/>
        </main>
        <Footer/>
        </>
    );
}