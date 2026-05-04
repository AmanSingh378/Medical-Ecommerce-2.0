import { db } from "@/configs/db";
import { storage } from "@/configs/firebaseConfigs";
import { productsTable, cartTable, orderTable } from "@/configs/schema";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextResponse } from "next/server";
import React from "react";
import { usersTable } from "@/configs/schema";
import { desc, eq, getTableColumns } from "drizzle-orm";

export async function POST(req) {
    //GetFormData(Fields, Files)
    const formData = await req.formData();
    const image = formData.get("image");
    const file = formData.get("file");
    const data = JSON.parse(formData.get("data"));

    console.log(image, file, data);

    //Save Product Image to Firebase Storage
    const imageName = Date.now() + ".png";
    const storageRef = ref(storage, "medical-e-cormce/" + imageName);

    await uploadBytes(storageRef, image).then(snapshot => {
        console.log("Image Uploaded Successfully");
    })
    const imageUrl = await getDownloadURL(storageRef);
    //Save Product File/Document to Firebase Storage
    const fileName = Date.now().toString();
    const storageFileRef = ref(storage, "medical-e-cormce/" + fileName);

    await uploadBytes(storageFileRef, file).then(snapshot => {
        console.log("File Uploaded Successfully");
    })
    const fileUrl = await getDownloadURL(storageFileRef);
    console.log(fileUrl);
    //Save FormData along with Url into Database

    const result = await db.insert(productsTable).values({
        title: data?.title,
        category: data?.category,
        description: data?.description,
        fileUrl: fileUrl,
        imageUrl: imageUrl,
        price: data?.price,
        about: data?.about,
        message: data?.message,
        createdBy: data?.userEmail
    }).returning(productsTable);

    return NextResponse.json(result);
}
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const id = searchParams.get('id');

    if (email) {
        const result = await db.select({
            ...getTableColumns(productsTable),
            user: {
                name: usersTable.name,
                image: usersTable.image
            }
        }).from(productsTable)
            .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
            .where(eq(productsTable.createdBy, email))
            .orderBy(desc(productsTable.id))
        return NextResponse.json(result);
    }
    if(id)
    {
        const result = await db.select({
        ...getTableColumns(productsTable),
        user: {
            name: usersTable.name,
            image: usersTable.image
        }
    }).from(productsTable)
        .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
        .where(eq(productsTable.id,id))
        .orderBy(desc(productsTable.id))

    return NextResponse.json(result[0]);
    }

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 9;
    const offset = (page - 1) * limit;
    const category = searchParams.get('category');
    
    let query = db.select({
        ...getTableColumns(productsTable),
        user: {
            name: usersTable.name,
            image: usersTable.image
        }
    }).from(productsTable)
        .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
        .orderBy(desc(productsTable.id));
    
    if (category) {
        query = query.where(eq(productsTable.category, category));
    }
    
    const result = await query.offset(offset).limit(limit);

    return NextResponse.json(result);

}

export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        const formData = await req.formData();
        const data = JSON.parse(formData.get("data") || '{}');
        const image = formData.get("image");
        const file = formData.get("file");

        let updateData = {
            title: data?.title,
            category: data?.category,
            description: data?.description,
            price: data?.price ? Number(data?.price) : undefined,
            about: data?.about,
            message: data?.message,
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        // Handle new image upload if provided
        if (image && image.size > 0) {
            const imageName = Date.now() + ".png";
            const storageRef = ref(storage, "medical-e-cormce/" + imageName);
            await uploadBytes(storageRef, image);
            const imageUrl = await getDownloadURL(storageRef);
            updateData.imageUrl = imageUrl;
        }

        // Handle new file upload if provided
        if (file && file.size > 0) {
            const fileName = Date.now().toString();
            const storageFileRef = ref(storage, "medical-e-cormce/" + fileName);
            await uploadBytes(storageFileRef, file);
            const fileUrl = await getDownloadURL(storageFileRef);
            updateData.fileUrl = fileUrl;
        }

        const result = await db.update(productsTable)
            .set(updateData)
            .where(eq(productsTable.id, id))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated successfully', product: result[0] });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        // Delete related cart records first due to foreign key constraints
        await db.delete(cartTable).where(eq(cartTable.productId, id));
        
        // Delete related order records
        await db.delete(orderTable).where(eq(orderTable.productId, id));
        
        // Delete the product
        const result = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
        
        if (result.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Product deleted successfully', product: result[0] });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
