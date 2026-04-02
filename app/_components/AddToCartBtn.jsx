import React, { useContext, useState } from "react"
import { toast } from "sonner";
import { CartContext } from "../_context/CartContext";
import { Button } from "@/components/ui/button";
import ProductEditableOption from "./ProductEditableOption";
import { MoreVerticalIcon } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

function AddToCartBtn({editable, size='sm', product}) {
    const { cart, setCart } = useContext(CartContext);
    const { user }= useUser();
    const [loading, setLoading] = useState(false);
    const AddToCart = async () => {
        setLoading(true)
        setCart(cart => [...cart, product]);
        const result = await axios.post('/api/cart', {
            email: user?.primaryEmailAddress?.emailAddress,
            productId: product?.id
        });
        toast('Item Added to Cart')
        setLoading(false);
    }
    return (
        <div>
            {!editable ?
                <Button size={size} className='mt-1 bg-blue-300 hover:bg-pink-300 w-full' disabled={loading} onClick={AddToCart}>
                    Add to Cart</Button>
                : <ProductEditableOption>
                    <MoreVerticalIcon />
                </ProductEditableOption>}
        </div>

    )

}

export default AddToCartBtn