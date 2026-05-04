'use client';

import React, { useState, useEffect } from "react"
import ProductCardItem from "./ProductCardItem"
import { useUser } from "@clerk/nextjs";

function DisplayProductList({productsList: initialProducts = []}){
    const { user } = useUser();
    const [products, setProducts] = useState(initialProducts);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setProducts(initialProducts);
        setIsHydrated(true);
    }, [initialProducts]);

    if (!isHydrated) {
        return (
            <div className="grid grid-cols-2 gap-5 mt-5 lg:grid-cols-2 xl:grid-cols-3">
                {[1,2,3,4,5,6].map((item,index)=>(
                    <div key={index} className="w-full rounded-lg h-50 bg-slate-300 animate-pulse">
                    </div>
                ))}
            </div>
        );
    }

    return(
         <div className="grid grid-cols-2 gap-5 mt-5 lg:grid-cols-2 xl:grid-cols-3">
            {products.length > 0 ? products.map((product) => (
                <ProductCardItem key={product.id} product={product} user={user}/>
            )) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                    No products available
                </div>
            )}
        </div>
    )
}

export default DisplayProductList
