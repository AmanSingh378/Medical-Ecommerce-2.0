"use client"
import ProductCardItem from "@/app/_components/ProductCardItem";
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react"

function UserListing() {
    const [listing, setListing] = useState([]);
    const [loading, setLoading] = useState(false);
    const {user} = useUser();

    useEffect(()=>{
        user&& GetUserProductList();
    },[user])
    
    const GetUserProductList=async()=>{
        setLoading(true);
        const result= await axios.get("/api/products?email="+user?.primaryEmailAddress?.emailAddress);
        setListing(result.data);
        setLoading(false);
    }

    const handleDelete = (productId) => {
        setListing(prev => prev.filter(p => p.id !== productId));
    }
    
    return (
        <div className="mt-5 ">
            <h2 className="flex items-center justify-between text-xl font-bold">Listing
                <Link href={"/add-product"}>
                    <Button className="bg-pink-400 hover:bg-red-500">+ Add New Product</Button>
                </Link>
            </h2>

            <div>
                {listing?.length==0&&
                    <h2 className="mt-10 text-2xl font-medium text-center text-gray-500">No Listing Found</h2>
                }
                
                <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-2 lg:grid-cols-3">
                    {listing.map((product,index)=>(
                        <ProductCardItem key={index} product={product}
                            editable={true}
                            onDelete={handleDelete}
                            />
                    ))}
                </div>
                
            </div>
        </div>
    )
}

export default UserListing