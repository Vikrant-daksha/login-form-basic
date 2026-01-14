import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext.tsx";
import FullBanner from "../assets/BannerFull.png"
import HalfBanner from"../assets/BannerHalf.png"
import PImage from "../assets/Product-img.webp"
import { FaUser } from "react-icons/fa6";
import { Carousel } from "../components/Carousel.jsx";
import { ProductList } from "../components/ProductMaker.tsx";


export function Home(){

    const { user, logout } = useAuth();
    const Location = useLocation()
    
    return(
        <>
        <div id="Hero-Banner" className="relative w-full">
            <img className="hidden w-full h-[80dvh] sm:block " src={HalfBanner}></img>
            <img className="block w-full h-auto sm:hidden" src={FullBanner} alt="" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-sans mb-5">Buy from Our Collection</p>
                <button className="border border-white px-3 py-1 rounded-sm">Collections</button>
            </div>
        </div>
        <div className="my-8 text-center sm:my-10">
            <h1 className="text-xl">Explore: Press Ons</h1>
        </div>
        <div id="Product-List" className="w-flex flex-col h-auto px-3 overflow-x-scroll overflow-auto scrollbar-hide md:mx-40">
            <Carousel speed={0.5}>
                <ProductList amt={7} layout={"flex"}/>
            </Carousel>
        </div>
        <div id="" className="mt-16 mb-12 px-6">
            <div className="mt-12 mb-8  text-center">
                <p className="font-semibold">Review from our customers</p>
                <p id="Overall-Rating" className="">4.2</p>
                <p className="text-[12px] font-light">Overall Reviews</p>
            </div>
            <div id="Comment-slider" className="overflow-x-hidden">
                <div id="Comment" className="border px-4.5 py-4">
                    <div className="mb-4 flex sm:flex justify-between">
                        <div id="Stars" className="font-bold">
                            4.5
                        </div>
                        <div id="date" className="font-extralight text-gray">
                            23/04/05
                        </div>
                    </div>
                    <div className="mb-6">
                        <p id="Subject / order" className="font-semibold mb-3">Love</p>
                        <p id="Content" className="font-light text-wrap">I have ordered blah with a little bit of bleh and got a bluh like the shit they doin</p>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                        <div className="flex text-sm">
                            <div id="User-profile" className="flex shrink-0 border rounded-full p-3 items-center mr-3">
                                <FaUser/>
                            </div>
                            <div className="flex flex-col">
                                <a className="">Clair Obsecure</a>
                                <a className="text-left">Expedition 33</a>
                            </div>
                        </div>
                        <div className="border rounded-sm p-1 max-h-10 max-w-10">
                            <img src={PImage}></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-pink-200 py-16 px-10 text-center text-[16px] xl:px-40">
            <div className="py-7 text-[12px]">
                MEET CHERRYBRUSH
            </div>
            <div className="flex flex-wrap sm:text-2xl lg:px-40">
                A high design nail art studio based in NYC, Paintbox transcends and transforms every aspect of the traditional manicure experience. Paintbox offers seasonal collections of thoughtfully-edited nail designs and colors reminiscent of runway and editorial trends.
            </div>
        </div>
        <div className="text-center py-8 mb-5">
            <div className="pb-4 text-xl">
                As Seen On Instagram
            </div>
            <div className="">
                Instapage
            </div>
        </div>
        <div className="grid px-2.5 gap-4 sm:grid-cols-2">
            <div className="relative w-full h-[28rem] sm:h-[30rem] lg:h-[40rem] overflow-hidden">
                <img src={HalfBanner} className="absolute w-full h-full object-cover object-center"></img>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 sm:px-20 ">
                    <p className="text-[14px] mb-3">NAMED</p>
                    <p className="text-wrap text-2xl mb-2">"Best Press Ons" By Instagram</p>
                    <p className="text-sm mb-3">2024 Awards</p>
                    <button className="border-2 px-4 py-1 text-[10px] tracking-[0.2rem] hover:bg-white hover:text-black ">READ NOW</button>
                </div>
            </div>
            <div className="relative w-full h-[28rem] sm:h-[30rem] lg:h-[40rem] overflow-hidden">
                <img src={HalfBanner} className="absolute w-full h-full object-cover object-center"></img>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 sm:px-20 ">
                    <p className="text-[14px] mb-3">NAMED</p>
                    <p className="text-wrap text-2xl mb-2">"Best Press Ons" By Instagram</p>
                    <p className="text-sm mb-3">2024 Awards</p>
                    <button className="border-2 px-4 py-1 text-[10px] tracking-[0.2rem] hover:bg-white hover:text-black ">READ NOW</button>
                </div>
            </div>
        </div>
        <div className="bg-pink-100 py-14 text-center text-wrap lg:px-56">
            <div className="flex flex-col-reverse mx-10 mb-16 sm:flex-row">
                <div className="flex flex-col justify-center items-center sm:pr-10">
                    <p className="text-sm font-light my-3 sm:mb-3">GIFT CARDS</p>
                    <p className="text-sm sm:text-3xl mb-6">Give the gift of the Paintbox experience for a manicure that tells a story.</p>
                    <button className="bg-black px-3 py-1.5 text-white text-[11px] tracking-[0.1rem]">BUY GIFT CARD</button>
                </div>
                <div className="flex shrink-0 text-right sm:w-1/2">
                    <img src={HalfBanner}></img>
                </div>
            </div>
            <div className="flex flex-col mx-10 mb-16 sm:flex-row">
                <div className="flex shrink-0 text-left sm:w-1/2">
                    <img src={HalfBanner}></img>
                </div>
                <div className="flex flex-col justify-center items-center sm:pl-10">
                    <p className="text-sm font-light my-3 sm:mb-3">GET INSPIRED</p>
                    <p className="text-sm sm:text-3xl mb-6">Follow us on Instagram & TikTok @paintboxnails</p>
                    <button className="bg-black px-3 py-1.5 text-white text-[11px] tracking-[0.1rem]">FOLLOW</button>
                </div>
            </div>
        </div>
        <div className="relative min-w-full h-[35rem] overflow-y-hidden">
        <img src={HalfBanner} className="w-1/3 h-full object-cover object-center"></img>
            <div className="absolute w-1/2 top-8 left-14 border bg-white sm:w-1/3 py-12 px-8 overflow-hidden">
                <h1 className="text-2xl">Visit Us</h1>
            <p className="py-3 text-sm">
                65 Greene Street<br/>
                New York, NY 10012
            </p>
            <ul className="list-disc pl-5 text-sm font-light pb-4">
                <li>Mon, 12:00pm - 7:00pm</li>
                <li>Tues, 12:00pm - 7:00pm</li>
                <li>Wed, 11:00am - 7:00pm</li>
                <li>Thurs, Fri, 10:30am - 7:30pm</li> 
                <li>Sat, 10:30am - 6:00pm</li>
                <li>Sun, 11:30am - 6:00pm</li>
            </ul>
            <p className="text-sm font-light pb-3">Send us an email at hi@paint-box.com for any studio-related inquiries</p>
            <p className="text-sm font-medium">Or text us at: +1 (402) 726-6817</p>
            </div>
        </div>
        <div className="mb-12 text-center">
            <p className="py-8 text-2xl">
                Join Our Community
            </p>
            <p className="px-6 font-light text-lg pb-6">
                Subscribe to our newsletter to be the first to know about new launches, sales and promotions, updates, 
            </p>
            <form method="POST" className="overflow-x-hidden sm:px-20">
                <input type="text" placeholder="Enter your email" className="border py-1.5 px-6"></input>
                <button type="submit" className="px-3 py-1.5 bg-black text-white tracking-widest">SUBSCRIBE</button>
            </form>
        </div>
        </>
    )
}