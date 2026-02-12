import React from "react";
import { useState, useEffect, useMemo } from "react";
import api from "../api/axiosinstance";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";

export function ProductList({amt, layout, page = ""}){
    
    type Product = {
        _id: string;
        product: string;
        price: number;
        image?: string;
        sale: boolean;
    };
    
    const [productList, setProductList] = useState<Product[]>([])
    const [pageName, setPageName] = useState("");
    const [sortBy, setSortBy] = useState("");
    
    
    useEffect(() => {
        const getProductList = async () => {
            try {
                const res = await api.get("/product");
                
                const response = res.data.response;
                
                setProductList(response);
                localStorage.setItem("products", JSON.stringify(response));
            } catch (err) {
                console.error("API error:", api, err);
            }
        };
        
        getProductList();
    }, []);

    useEffect(() => {
        if(page){
            setPageName(page);
        }
    },[page]
    )
    
    const sortedProducts = useMemo(() => {
        return [...productList].sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            if (sortBy === "name-asc") return a.product.localeCompare(b.product);
            return 0;
        });
    }, [productList, sortBy]);
    
    const itemsToRender = sortedProducts.slice(0, amt);
    
    return(
        <>
        {layout === "flex" ? (
            <div id="Product-List" className="flex flex-row">
            {itemsToRender.map((product) => (
                <div key={product._id}  className="min-w-[50%] md:min-w-[25%] lg:min-w-[20%] w-full border mr-2.5 ">
                    <div className="relative">
                        <img src={product.image}></img>
                        {product.sale && (
                        <span className="absolute top-0 right-0 bg-black py-1 px-2 text-sm text-white">
                            Sale
                        </span>
                        )}
                    </div>
                    <div className="text-wrap text-center my-3">
                        <p className="mb-1">{product.product}</p>
                        <p className="">{product.price}</p>
                    </div>
                </div>
            ))}
        </div>
        ) 
        : 
        (<>
        <div className="flex justify-between items-center px-2 py-5">
        <div className="font-semibold text-lg">
            <p>{pageName}</p>
        </div>
        <div id="Sort">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border px-4 py-1 rounded-sm appearance-none focus:outline-none focus:ring-0 focus-within:border" >
                <option value="" disabled>Sort By</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A–Z</option>
            </select>
        </div>
        </div>
        
        <div id="Product-List" className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            {itemsToRender.map((product) => (
                <div key={product._id}  className="max-w-64 w-full h-fit mx-auto bg-pink-50 rounded-xl">
                    <Link to={`/products/${product.product}`}>
                    <div className="relative rounded-xl overflow-clip">
                        <img src={product.image}></img>
                        <span className="absolute top-2 left-2 bg-white rounded-full px-1 py-1 text-sm"><FaHeart/></span>
                        {product.sale && (
                        <span className="absolute uppercase top-0 right-0 bg-black py-1 px-2 text-[10px] tracking-widest text-white rounded-bl-lg">
                            Sale
                        </span>
                        )}
                    </div>
                    <div className="flex flex-col items-center text-wrap my-3">
                        <p className="text-xl uppercase tracking-widest mb-1">{product.product}</p>
                        <p className="text-[16px]"><span id="currency-symbol" className="pr-1">₹</span>{product.price}</p>
                    </div>
                    <div className="">
                        <button className="w-full flex justify-center items-center rounded-lg py-1.5 text-[12px] uppercase tracking-wide bg-pink-100"><FaCartShopping className="mr-3"/>Add to Cart</button>
                    </div>
                    </Link>
                </div>
            ))}
        </div>
        </>
        )
         }
        
        </>
    );
}