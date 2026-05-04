ALTER TABLE "orders" ADD COLUMN "paymentId" varchar;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "amount" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "phone" varchar(50);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "createdAt" timestamp DEFAULT now();

