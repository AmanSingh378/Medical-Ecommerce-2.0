
import { integer, pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  image: varchar(),
  email: varchar({ length: 255 }).notNull().unique(),
});


export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  price: integer().notNull(),
  description: text().notNull(),
  about: text(),
  category: varchar().notNull(),
  imageUrl: varchar().notNull(),
  fileUrl: varchar().notNull(),
  message: varchar(),
  createdBy: varchar('createdBy').notNull().references(() => usersTable.email),
});

export const cartTable=pgTable("cart",{
  id:integer().primaryKey().generatedAlwaysAsIdentity(),
  email:varchar('email').notNull().references(() => usersTable.email),
  productId:integer().notNull().references(()=>productsTable.id),
});

export const orderTable= pgTable('orders',{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email:varchar('email').notNull().references(() => usersTable.email),
    productId:integer().notNull().references(()=>productsTable.id),
})

export const queriesTable = pgTable("queries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const feedbacksTable = pgTable("feedbacks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});
