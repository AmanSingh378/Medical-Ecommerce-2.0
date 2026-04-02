import React from "react"
import ProductCardItem from "./ProductCardItem"
import { useUser } from "@clerk/nextjs";


function DisplayProductList({productsList}){
    const { user }= useUser();
    return(
         <div className="grid grid-cols-2 gap-5 mt-5 lg:grid-cols-2 xl:grid-cols-3">
            {productsList?.length>0?productsList.map((product,index) => (
                <ProductCardItem product={product} key={index} user={user}/>
            )):
            [1,2,3,4,5,6].map((item,index)=>(
                <div key={index} className="w-full rounded-lg h-50 bg-slate-300 animate-pulse">
                    
                </div>
            ))
            } 
        </div>
    )
}

export default DisplayProductList