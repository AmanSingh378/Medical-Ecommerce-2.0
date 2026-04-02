import { Card } from "@/components/ui/card"
import React, { useContext, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MoreVerticalIcon } from "lucide-react"
import ProductEditableOption from "./ProductEditableOption"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { CartContext } from "../_context/CartContext"
import { toast } from "sonner"
import AddToCartBtn from "./AddToCartBtn"

function ProductCardItem({ product, editable = false,user }) {

    const {cart, setCart}= useContext(CartContext);
    const [loading, setLoading]= useState(false);
    //const {user}= useUser();
    const AddToCart=async()=>{
        setLoading(true)
        setCart(cart=>[...cart,product]);
        const result = await axios.post('/api/cart',{
            email: user?.primaryEmailAddress?.emailAddress,
            productId: product?.id
        });
        toast('Item Added to Cart')
        setLoading(false);
    }
    
    return product&&(
        <Link href={'/explore/' + product?.id}>
            <div className="height=900">
                <Card className="p-1 md:p-3">
                    <Image src={product?.imageUrl} alt={product?.title || "Products Image"} width={400} height={300}
                        className="object-cover h-50" />
                    <div className="mt-3">
<h2 className="text-xl font-bold md:text-xl line-clamp-1">{product?.title}</h2>
                        <h2 className="text-2xl font-bold text-yellow-500">₹{product?.price}</h2>
                        <div className="items-center justify-between mt-3 md:flex">
                            <div className="flex items-center gap-2">
                                <Image src={product?.user?.image} alt={product?.user?.name || "User Avatar"} width={40} height={40} className="mt-3 rounded-full" />
                                <h2 className="text-sm text-gray-400">{product?.user?.name}</h2>
                            </div>
                            <AddToCartBtn editable={editable} product={product}/>
                        </div>
                    </div>
                </Card>
            </div>
        </Link>
    )
}

export default ProductCardItem