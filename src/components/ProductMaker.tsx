import React from "react";
import { useState, useEffect } from "react";
import api from "../api/axiosinstance";

export function ProductList({amt = 4, layout}){
    
    type Product = {
        _id: string;
        product: string;
        price: number;
        image?: string;
        sale: boolean;
    };
    
    const [productList, setProductList] = useState<Product[]>([])

    const itemsToRender = productList.slice(0, amt);

    useEffect(() => {
        const getProductList = async () => {
          try {
            const res = await api.get("/product");
    
            const response = res.data.response;
    
            setProductList(response);
            localStorage.setItem("products", JSON.stringify(response));
          } catch (err) {
            console.error("API error:", err);
          }
        };
    
        getProductList();
      }, []);

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
        (
        <div id="Product-List" className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            {itemsToRender.map((product) => (
                <div key={product._id}  className="max-w-64 w-full h-fit border mx-auto">
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
         }
        
        </>
    );
}