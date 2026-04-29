CREATE TYPE "public"."shipping_carrier" AS ENUM('dhl', 'hermes', 'ups', 'fedex');--> statement-breakpoint
CREATE TYPE "public"."shipping_method" AS ENUM('standard', 'express', 'same_day');--> statement-breakpoint
ALTER TABLE "shipping" ALTER COLUMN "carrier" SET DATA TYPE "public"."shipping_carrier" USING "carrier"::"public"."shipping_carrier";--> statement-breakpoint
ALTER TABLE "shipping" ALTER COLUMN "method" SET DATA TYPE "public"."shipping_method" USING "method"::"public"."shipping_method";