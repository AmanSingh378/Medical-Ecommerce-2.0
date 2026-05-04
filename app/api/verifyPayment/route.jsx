import { createHmac } from 'crypto';
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID,
});

export async function POST(req) {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

        // Validate required fields
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return NextResponse.json(
                { verified: false, error: "Missing required payment details (payment_id, order_id, signature)" },
                { status: 400 }
            );
        }

        // Get secret key (support both naming conventions)
        const key_secret = process.env.RAZORPAY_SECRET_ID || process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
            console.error("Razorpay secret key not found in env vars");
            return NextResponse.json(
                { verified: false, error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Standard Razorpay signature verification using HMAC SHA256
        const shasum = createHmac('sha256', key_secret);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const expectedSignature = shasum.digest('hex');

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (!isSignatureValid) {
            console.error("Signature verification failed");
            return NextResponse.json(
                { verified: false, error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Optional: Double-check payment status with Razorpay API
        try {
            const payment = await razorpay.payments.fetch(razorpay_payment_id);
            if (payment.status === 'captured') {
                console.log("Payment verified successfully (signature + API):", razorpay_payment_id);
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
                console.error("Payment not captured:", payment.status);
                return NextResponse.json(
                    { verified: false, error: `Payment status: ${payment.status}` },
                    { status: 400 }
                );
            }
        } catch (apiError) {
            // If API check fails, trust signature verification (standard Razorpay practice)
            console.warn("Razorpay API check failed, trusting signature:", apiError.message);
            console.log("Payment verified by signature:", razorpay_payment_id);
            return NextResponse.json({
                verified: true,
                payment: {
                    id: razorpay_payment_id,
                    order_id: razorpay_order_id,
                    status: 'verified_by_signature',
                }
            });
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
