"use client"
import React, { useEffect, useState } from "react"
import axios from "axios";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Package, IndianRupee, ShoppingCart, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

function ProductAnalytics() {
    const [product, setProduct] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const router = useRouter();
    const productId = params?.productId;

    useEffect(() => {
        if (productId) {
            fetchData();
        }
    }, [productId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productRes, ordersRes] = await Promise.all([
                axios.get(`/api/products?id=${productId}`),
                axios.get(`/api/orders?productId=${productId}`)
            ]);
            setProduct(productRes.data);
            setOrders(ordersRes.data?.orders || []);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(o => o.email)).size;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2Icon className="w-10 h-10 animate-spin text-pink-400" />
            </div>
        );
    }

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold">Product Analytics</h2>
                    <p className="text-gray-500">Sales and performance insights for your product.</p>
                </div>
                <Button className="text-blue-400" variant="outline" onClick={() => router.push('/dashboard')}>
                    Back to Dashboard
                </Button>
            </div>

            {/* Product Info Card */}
            <Card className="p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <Image 
                        src={product?.imageUrl || '/image1.png'} 
                        alt={product?.title} 
                        width={200} 
                        height={200} 
                        className="object-contain rounded-lg" 
                    />
                    <div>
                        <h3 className="text-2xl font-bold">{product?.title}</h3>
                        <Badge className="bg-yellow-400 mt-2">{product?.category}</Badge>
                        <p className="text-xl font-bold text-yellow-500 mt-2">₹{product?.price}</p>
                        <p className="text-gray-500 mt-2 max-w-xl">{product?.description}</p>
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <Card className="p-6 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-full">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Orders</p>
                        <p className="text-2xl font-bold">{totalOrders}</p>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4">
                    <div className="p-4 bg-green-100 rounded-full">
                        <IndianRupee className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold">₹{totalRevenue}</p>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4">
                    <div className="p-4 bg-purple-100 rounded-full">
                        <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Unique Customers</p>
                        <p className="text-2xl font-bold">{uniqueCustomers}</p>
                    </div>
                </Card>
            </div>

            {/* Orders Table */}
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Order History</h3>
                {orders.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No orders yet for this product.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-3 font-semibold">Order ID</th>
                                    <th className="pb-3 font-semibold">Customer Email</th>
                                    <th className="pb-3 font-semibold">Product</th>
                                    <th className="pb-3 font-semibold">Price</th>
                                    <th className="pb-3 font-semibold">Payment ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={index} className="border-b last:border-0">
                                        <td className="py-3">#{order.id}</td>
                                        <td className="py-3">{order.email}</td>
                                        <td className="py-3">{order.title}</td>
                                        <td className="py-3 font-medium">₹{order.price}</td>
                                        <td className="py-3 text-sm text-gray-500">{order.paymentId || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default ProductAnalytics

