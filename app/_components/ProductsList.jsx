"use client"

import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import DisplayProductList from "./DisplayProductList"

function ProductsList({ category = null }) {
    const [productsList, setProductsList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        GetProductList(1, category);
    }, [category]);

    const GetProductList = async (currentPage, cat) => {
        setLoading(true);
        console.log("HERE", cat, currentPage);
        let url = `/api/products?page=${currentPage}&limit=6`;
        if (cat) {
            url += `&category=${encodeURIComponent(cat)}`;
        }
        try {
            const result = await axios.get(url);
            console.log(result);
            const data = result.data || [];
            if (currentPage === 1) {
                setProductsList(data);
            } else {
                setProductsList(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const newProducts = data.filter(p => !existingIds.has(p.id));
                    return [...prev, ...newProducts];
                });
            }
            if (data.length < 6) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            if (currentPage === 1) {
                setProductsList([]);
            }
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        GetProductList(nextPage, category);
    };

    const handleShowLess = () => {
        // Keep only the first 6 products and reset page to 1
        setProductsList(prev => prev.slice(0, 6));
        setPage(1);
        setHasMore(true);
    };

    return (
        <div suppressHydrationWarning>
            <h2 className="flex items-center justify-between text-xl font-bold">Featured
                <span>
                    <Link href={'/explore'}>
                        <Button className='bg-blue-400 hover:bg-pink-300'>View All</Button>
                    </Link>
                </span>
            </h2>
            <DisplayProductList productsList={productsList} />
            {productsList.length > 0 && (
                <div className="flex items-center justify-center mt-8 gap-4">
                    {hasMore && (
                        <Button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="bg-blue-400 hover:bg-pink-300 min-w-35"
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </Button>
                    )}
                    {productsList.length > 6 && (
                        <Button
                            onClick={handleShowLess}
                            variant="outline"
                            className="min-w-35 border-blue-400 text-blue-400 hover:bg-blue-50"
                        >
                            View Less
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProductsList;

