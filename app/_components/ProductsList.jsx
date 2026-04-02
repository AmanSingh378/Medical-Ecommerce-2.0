"use client"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import Product from "../_mockData/products"
import ProductCardItem from "./ProductCardItem"
import axios from "axios"
import Link from "next/link"
import DisplayProductList from "./DisplayProductList"

function ProductsList({ category = null }) {
    const [productsList, setProductsList] = useState([])

    useEffect(() => {
        GetProductList(category)
    }, [category]);
    
    const GetProductList= async(cat)=>{
        console.log("HERE", cat)
        let url = '/api/products?page=1&limit=9';
        if (cat) {
            url += `&category=${cat}`;
        }
        const result = await axios.get(url)
        console.log(result);
        setProductsList(result.data)
    }
    
  return (
    <div>
        <h2 className="flex items-center justify-between text-xl font-bold">Featured
        <span>
            <Link href={'explore'}>
            <Button className='bg-blue-400 hover:bg-pink-300'>View All</Button>
            </Link></span>
        </h2>

       <DisplayProductList productsList={productsList}/>
    </div>
    )
}

export default ProductsList