import React from "react";
import { ProductList } from "../components/ProductList";

export function Catalog(){


    /*<SortBy value={sortBy} onChange={setSortBy}/>*/
    return(
        <>
        <div className="px-4 py-5">
            <ProductList page={"Press on Nails"}/>
        </div>
        </>
    );
}