import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID,
});

export async function POST(req) {
    try {
        const { amount } = await req.json();

        // Validate amount
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount. Amount must be greater than 0" },
                { status: 400 }
            );
        }

        // Create order with Razorpay
        const order = await razorpay.orders.create({
            amount: amount,
            currency: "INR",
            receipt: `order_${Date.now()}`,
        });

        if (!order || !order.id) {
            throw new Error("Failed to create order");
        }

        console.log("Razorpay order created:", order.id);
        
        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        
        return NextResponse.json(
            { 
                error: "Failed to create payment order",
                details: error.message 
            },
            { status: 500 }
        );
    }
}
