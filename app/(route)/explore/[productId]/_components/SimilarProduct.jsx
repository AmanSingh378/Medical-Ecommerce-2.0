"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

function SimilarProduct({ category, currentProductId }) {
    const [similarProducts, setSimilarProducts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (category) {
            GetSimilarProducts()
        }
    }, [category, currentProductId])

    const GetSimilarProducts = async () => {
        setLoading(true)
        try {
            const result = await axios.get(`/api/products?category=${encodeURIComponent(category)}&limit=8`)
            // Filter out the current product
            const filtered = (result.data || []).filter(p => p.id !== Number(currentProductId))
            setSimilarProducts(filtered.slice(0, 6))
        } catch (error) {
            console.error("Failed to fetch similar products:", error)
            setSimilarProducts([])
        }
        setLoading(false)
    }

    if (!category) return null

    return (
        <div>
            <h2 className="text-2xl font-bold mb-5">Similar Products</h2>
            
            {loading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="h-48 rounded-lg bg-slate-200 animate-pulse"></div>
                    ))}
                </div>
            ) : similarProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No similar products found in {category} category.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {similarProducts.map((product, index) => (
                        <Link href={`/explore/${product.id}`} key={index}>
                            <Card className="p-3 hover:shadow-lg transition-shadow cursor-pointer">
                                <Image 
                                    src={product?.imageUrl} 
                                    alt={product?.title || "Product"} 
                                    width={300} 
                                    height={200}
                                    className="object-cover h-40 w-full rounded-md"
                                />
                                <div className="mt-2">
                                    <h3 className="font-bold text-sm line-clamp-1">{product?.title}</h3>
                                    <p className="text-yellow-600 font-bold mt-1">₹{product?.price}</p>
                                    <p className="text-xs text-gray-400">{product?.category}</p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SimilarProduct

