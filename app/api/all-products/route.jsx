import { db } from "@/configs/db";
import { productsTable, usersTable } from "@/configs/schema";
import { asc, desc, eq, getTableColumns, ilike, like } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { limit, offset, searchText, sort} = await req.json();
    console.log("Sort",sort)

    try {
        const result = await db.select({
            ...getTableColumns(productsTable),
            user: {
                name: usersTable.name,
                image: usersTable.image
            }
        }).from(productsTable)
            .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
            .where(ilike(productsTable.title, '%' + searchText + '%'))
            .orderBy( sort.order=='desc'?desc(productsTable[sort?.field]):asc(productsTable[sort?.field]))
            .limit(Number(limit))
            .offset(offset)
            return NextResponse.json(result);
    }
    catch(e)
    {
        return NextResponse.json({error:"International Server Error"})
    }
    
}
