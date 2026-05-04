import { db } from "@/configs/db";
import { orderTable, productsTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const productId = searchParams.get("productId");

    if (productId) {
      const ordersWithProducts = await db
        .select({
          id: orderTable.id,
          email: orderTable.email,
          productId: orderTable.productId,
          paymentId: orderTable.paymentId,
          amount: orderTable.amount,
          name: orderTable.name,
          phone: orderTable.phone,
          address: orderTable.address,
          createdAt: orderTable.createdAt,
          title: productsTable.title,
          price: productsTable.price,
          imageUrl: productsTable.imageUrl,
          category: productsTable.category,
        })
        .from(orderTable)
        .leftJoin(productsTable, eq(orderTable.productId, productsTable.id))
        .where(eq(orderTable.productId, productId));

      return NextResponse.json({
        orders: ordersWithProducts,
      });
    }

    if (!email) {
      return NextResponse.json({ orders: [] });
    }

    // Simple query - return empty if no data
    const ordersWithProducts = await db
      .select({
        id: orderTable.id,
        email: orderTable.email,
        productId: orderTable.productId,
        paymentId: orderTable.paymentId,
        amount: orderTable.amount,
        name: orderTable.name,
        phone: orderTable.phone,
        address: orderTable.address,
        createdAt: orderTable.createdAt,
        title: productsTable.title,
        price: productsTable.price,
        imageUrl: productsTable.imageUrl,
        category: productsTable.category,
      })
      .from(orderTable)
      .leftJoin(productsTable, eq(orderTable.productId, productsTable.id))
      .where(eq(orderTable.email, email));

    return NextResponse.json({
      orders: ordersWithProducts,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ orders: [] });
  }
}
