import { Card } from "@/components/ui/card"
import axios from "axios"
import Image from "next/image"
import React, { useContext } from "react"
import { toast } from "sonner"
import { CartContext } from "../_context/CartContext"
import { index } from "drizzle-orm/mysql-core"
import RemoveFromCart from "./RemoveFromCart"

function CartProductItem({product}) {

    const{cart, setCart}= useContext(CartContext);
    const RemoveItem=async()=>{
        const CartList= cart.filter((item)=> item.id!=product.id);
        setCart(CartList)
        const result= await axios.delete('/api/cart?recordId='+product?.id)
        toast('Item Removed');
    }

    return(
        <Card className="flex gap-5">
            <Image src={product?.imageUrl} alt={product?.title}
             width={70} height={70}
             className="h-20 w-20 object-cover"/>
            <div>
                <h2 className="font-bold">{product?.title}</h2>
                <h2 className="font-bold text-yellow-500 text-lg">₹{product?.price}</h2>
                <RemoveFromCart product={product} />
            </div>
        </Card>
    )
}

export default CartProductItem