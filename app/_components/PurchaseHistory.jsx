"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const PurchaseHistory = ({ userEmail }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setError("User email required");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  if (loading) return <div className="text-center py-8">Loading purchase history...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">No orders until now</h2>
        <Link href="/explore" className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Go to Explore & Buy Now
        </Link>
      </div>
    );
  }

  const calculateTotal = (order) => order.price; // Single product per order based on schema

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Purchase History</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className="p-4">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Image
                  src={order.imageUrl}
                  alt={order.title}
                  width={80}
                  height={80}
                  className="object-cover rounded-lg"
                />
                <div>
                  <CardTitle className="text-lg">{order.title}</CardTitle>
                  <p className="text-sm text-gray-500">{order.category}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <p className="font-semibold text-lg">₹{calculateTotal(order)}</p>
              {order.paymentId && (
                <p className="text-sm text-green-600">Payment ID: {order.paymentId}</p>
              )}
              <p className="text-sm text-gray-500">
                Ordered on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistory;

