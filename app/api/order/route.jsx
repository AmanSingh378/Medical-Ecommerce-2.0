import { db } from "@/configs/db";
import { cartTable, orderTable } from "@/configs/schema";
import EmailOrder from "@/emails/email";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    try {
        // Get Order Detail
        const { orderDetail, email, paymentId, amount, name, phone, address } = await req.json();
        
        // Validate required fields
        if (!orderDetail || !email) {
            return NextResponse.json(
                { error: "Missing required order details" },
                { status: 400 }
            );
        }

        if (!orderDetail || orderDetail.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        console.log("Processing order for:", email);
        if (paymentId) {
            console.log("Payment ID:", paymentId);
        }

        // Insert record to Order Table
        let orderList = [];
        orderDetail.forEach((order) => {
            orderList.push({
                email: email,
                productId: order.id,
                paymentId: paymentId || null,
                amount: amount || order.price || null,
                name: name || null,
                phone: phone || null,
                address: address || null,
                createdAt: new Date(),
            })
        });

        const result = await db.insert(orderTable)
            .values(orderList);

        // Delete user cart item
        const deleteResult = await db.delete(cartTable)
            .where(eq(cartTable.email, email));

        // Send Email (in production, you would send to the actual user email)
        try {
            const sendEmailResult = await SendEmail(orderDetail, email);
            console.log("Email sent:", sendEmailResult);
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
            // Don't fail the order if email fails
        }

        console.log("Order created successfully");
        
        return NextResponse.json({
            success: true,
            orderId: result.insertId || result[0]?.id,
            message: "Order created successfully"
        });

    } catch (error) {
        console.error("Order creation error:", error);
        
        return NextResponse.json(
            { 
                error: "Failed to create order",
                details: error.message 
            },
            { status: 500 }
        );
    }
}

const SendEmail = async (orderDetail, userEmail) => {
    try {
        const result = await resend.emails.send({
            from: 'medicare@amansingh-app.com',
            to: userEmail || 'as2172025@gmail.com', // Use actual user email
            subject: 'Order Delivery Receipt',
            react: <EmailOrder orderDetail={orderDetail}/>,
        });

        return result;
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
}
