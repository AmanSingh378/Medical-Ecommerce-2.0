"use client"
import products from "@/app/_mockData/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import SimilarProduct from "./_components/SimilarProduct";
import AddToCartBtn from "@/app/_components/AddToCartBtn";

function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState();
    useEffect(() => {
        GetProductDetail();
    }, [])

    const GetProductDetail = async () => {
        const result = await axios.get('/api/products?id=' + productId);
        console.log(result.data);
        setProduct(result?.data)
    }
    return product&& (
        <div className="mt-10 ">
            <h2>BACK</h2>

            <div className="grid grid-cols-1 gap-10 mt-6 md:grid-cols-2">
                <Card className="flex items-center justify-center max-h-96">
                    <Image src={product?.imageUrl} alt="image" width={400} height={400} className="object-contain h-96 w-96" />
                </Card>
                <div className="flex flex-col gap-5">
                    <div>
                        <h2 className="text-3xl font-bold">{product?.title}</h2>
                        <Badge className={"bg-yellow-400 mt-2"}>{product?.category}</Badge>
                        <h2 className="mt-5 text-2xl font-bold text-yellow-400">₹{product?.price}</h2>

                        <p className="mt-3 text-gray-500">The {product?.category} will send to your register email id once you purchase this digital content.</p>

                        {/*<Button className="w-full p-4 mt-4 bg-pink-400 hover:bg-yellow-300" size="lg">Add to cart</Button>*/}
                        <AddToCartBtn product={product} className="w-full p-4 mt-4 bg-pink-400 hover:bg-yellow-300" size="lg"/>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Description</AccordionTrigger>
                                <AccordionContent>
                                    {product?.description}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>About Product</AccordionTrigger>
                                <AccordionContent>
                                    {product?.about}
                                </AccordionContent>
                            </AccordionItem>
                            
                        </Accordion>
                    </div>
                </div>
            </div>
            
            <div className="mt-10">
                <SimilarProduct category={ProductDetail?.category}/>
            </div>
        </div>
    )
}

export default ProductDetail