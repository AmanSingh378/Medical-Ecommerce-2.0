import { Card } from "@/components/ui/card"
import Image from "next/image"
import React from "react"
import RemoveFromCart from "./RemoveFromCart"

function CheckoutProductItem({ product }) {
    return (
        <div>
            <Card className="p-3 flex gap-5 justify-between items-center">
                <div className="flex gap-5">
                    <Image src={product?.imageUrl} alt={product.title}
                        width={100}
                        height={100}
                        className="object-cover h-20 w-20"
                    />
                    <div>
                        <h2 className="font-medium text-lg">{product?.title}</h2>
                        <h2 className="text-gray-400">{product?.category}</h2>
                        <RemoveFromCart product={product} />
                    </div>
                </div>
                <h2 className="font-bold text-lg">${product?.price}</h2>

            </Card>
        </div>
    )
}

export default CheckoutProductItem