CREATE OR REPLACE FUNCTION "public"."ensure_order_has_payment_and_shipping"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
	missing_payment_order_id uuid;
	missing_shipping_order_id uuid;
BEGIN
	SELECT o.id
	INTO missing_payment_order_id
	FROM "order" o
	WHERE NOT EXISTS (
		SELECT 1
		FROM "payment" p
		WHERE p.order_id = o.id
	)
	LIMIT 1;

	IF missing_payment_order_id IS NOT NULL THEN
		RAISE EXCEPTION
			'Order % must have a payment row',
			missing_payment_order_id;
	END IF;

	SELECT o.id
	INTO missing_shipping_order_id
	FROM "order" o
	WHERE NOT EXISTS (
		SELECT 1
		FROM "shipping" s
		WHERE s.order_id = o.id
	)
	LIMIT 1;

	IF missing_shipping_order_id IS NOT NULL THEN
		RAISE EXCEPTION
			'Order % must have a shipping row',
			missing_shipping_order_id;
	END IF;

	RETURN NULL;
END;
$$;--> statement-breakpoint

CREATE CONSTRAINT TRIGGER "order_requires_payment_and_shipping_after_order"
AFTER INSERT OR UPDATE
ON "order"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION "public"."ensure_order_has_payment_and_shipping"();--> statement-breakpoint

CREATE CONSTRAINT TRIGGER "order_requires_payment_and_shipping_after_payment"
AFTER INSERT OR UPDATE OR DELETE
ON "payment"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION "public"."ensure_order_has_payment_and_shipping"();--> statement-breakpoint

CREATE CONSTRAINT TRIGGER "order_requires_payment_and_shipping_after_shipping"
AFTER INSERT OR UPDATE OR DELETE
ON "shipping"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION "public"."ensure_order_has_payment_and_shipping"();--> statement-breakpoint
