import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID,
});

export async function POST(req) {
    try {
        const { razorpay_payment_id, razorpay_order_id } = await req.json();

        // Validate required fields
        if (!razorpay_payment_id || !razorpay_order_id) {
            return NextResponse.json(
                { verified: false, error: "Missing required payment details" },
                { status: 400 }
            );
        }

        // Fetch the payment details from Razorpay
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        if (!payment) {
            return NextResponse.json(
                { verified: false, error: "Payment not found" },
                { status: 404 }
            );
        }

        // Verify payment status
        if (payment.status === 'captured' || payment.status === 'authorized') {
            // Optionally verify order_id matches
            if (payment.order_id === razorpay_order_id) {
                console.log("Payment verified successfully:", razorpay_payment_id);
                
                return NextResponse.json({
                    verified: true,
                    payment: {
                        id: payment.id,
                        order_id: payment.order_id,
                        amount: payment.amount,
                        currency: payment.currency,
                        status: payment.status,
                    }
                });
            } else {
                console.error("Order ID mismatch");
                return NextResponse.json(
                    { verified: false, error: "Order ID mismatch" },
                    { status: 400 }
                );
            }
        } else {
            console.error("Payment not successful:", payment.status);
            return NextResponse.json(
                { 
                    verified: false, 
                    error: `Payment status: ${payment.status}` 
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        
        return NextResponse.json(
            { 
                verified: false, 
                error: "Payment verification failed",
                details: error.message 
            },
            { status: 500 }
        );
    }
}
