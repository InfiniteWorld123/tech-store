CREATE TABLE "stripe_payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"checkout_session_id" text NOT NULL,
	"payment_intent_id" text,
	"customer_id" text,
	"currency" text NOT NULL,
	"checkout_url" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stripe_payment_payment_id_unique" UNIQUE("payment_id"),
	CONSTRAINT "stripe_payment_checkout_session_id_unique" UNIQUE("checkout_session_id")
);
--> statement-breakpoint
ALTER TABLE "stripe_payment" ADD CONSTRAINT "stripe_payment_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;