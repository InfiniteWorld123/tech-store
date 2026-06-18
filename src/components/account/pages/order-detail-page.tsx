"use client";

import { Button, Chip, Skeleton, toast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	CalendarDays,
	CheckCircle,
	CreditCard,
	Hash,
	MapPin,
	Package,
	ReceiptText,
	RotateCcw,
	Truck,
	X,
} from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useCancelOrder } from "#/mutations/orders/use-cancel-order";
import { useCreateStripeCheckout } from "#/mutations/orders/use-create-stripe-checkout";
import { useReorderOrder } from "#/mutations/orders/use-reorder-order";
import { useConfirmPayment } from "#/mutations/payments/use-confirm-payment";
import {
	getCustomerOrderDetailQueryOptions,
	getOrderTrackingQueryOptions,
} from "#/queries/orders.queries";
import { getPaymentQueryOptions } from "#/queries/payments.queries";
import { Route } from "#/routes/account/orders/$orderId";
import type {
	OrderStatusType,
	PaymentStatusType,
} from "#/server/orders/admin/admin.types";
import { OrderTrackingSection } from "../sections/order-tracking-section";

type ChipColor = "default" | "accent" | "success" | "danger" | "warning";

const ORDER_STATUS_COLORS: Record<OrderStatusType, ChipColor> = {
	pending: "accent",
	processing: "accent",
	completed: "success",
	cancelled: "danger",
};

const ORDER_STATUS_LABELS: Record<OrderStatusType, string> = {
	pending: "Pending",
	processing: "Processing",
	completed: "Completed",
	cancelled: "Cancelled",
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatusType, ChipColor> = {
	pending: "accent",
	paid: "success",
	failed: "danger",
	refunded: "warning",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatusType, string> = {
	pending: "Payment pending",
	paid: "Paid",
	failed: "Payment failed",
	refunded: "Refunded",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
	card: "Card",
	paypal: "PayPal",
	bank_transfer: "Bank transfer",
	cash_on_delivery: "Cash on delivery",
};

const SHIPPING_CARRIER_LABELS: Record<string, string> = {
	dhl: "DHL",
	hermes: "Hermes",
	ups: "UPS",
	fedex: "FedEx",
};

const SHIPPING_METHOD_LABELS: Record<string, string> = {
	standard: "Standard",
	express: "Express",
	same_day: "Same day",
};

const SHIPPING_STATUS_LABELS: Record<string, string> = {
	pending: "Pending",
	packed: "Packed",
	shipped: "Shipped",
	in_transit: "In transit",
	delivered: "Delivered",
};

const currencyFormatter = new Intl.NumberFormat("de-DE", {
	style: "currency",
	currency: "EUR",
});

const formatCurrency = (amount: number) => currencyFormatter.format(amount);

const formatDate = (value: string | null | undefined) => {
	if (!value) return "—";
	return new Date(value).toLocaleDateString("en-DE", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const formatDateTime = (value: string | null | undefined) => {
	if (!value) return "—";
	return new Date(value).toLocaleString("en-DE", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const formatFallbackLabel = (value: string | null | undefined) =>
	value
		? value
				.replaceAll("_", " ")
				.replace(/\b\w/g, (letter) => letter.toUpperCase())
		: "—";

const labelFor = (labels: Record<string, string>, value: string | null) =>
	value ? (labels[value] ?? formatFallbackLabel(value)) : "—";

function DetailRow({
	label,
	value,
	mono,
}: {
	label: string;
	value: ReactNode;
	mono?: boolean;
}) {
	const displayValue =
		value === null || value === undefined || value === "" ? "—" : value;

	return (
		<div className="grid gap-1 text-sm sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-4">
			<span className="text-muted">{label}</span>
			<span
				className={`min-w-0 break-words text-foreground sm:text-right ${mono ? "break-all font-mono text-xs" : ""}`}
			>
				{displayValue}
			</span>
		</div>
	);
}

function SummaryTile({
	icon,
	label,
	value,
	caption,
}: {
	icon: ReactNode;
	label: string;
	value: ReactNode;
	caption?: ReactNode;
}) {
	return (
		<div className="rounded-lg border border-border bg-surface p-4">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="text-xs font-semibold uppercase tracking-wide text-muted">
						{label}
					</p>
					<p className="mt-1 text-sm font-bold text-foreground break-words">
						{value}
					</p>
					{caption ? (
						<p className="mt-1 text-xs text-muted break-words">{caption}</p>
					) : null}
				</div>
				<span className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-muted">
					{icon}
				</span>
			</div>
		</div>
	);
}

function DetailSection({
	icon,
	title,
	children,
}: {
	icon: ReactNode;
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="rounded-lg border border-border bg-surface">
			<div className="flex items-center gap-2 border-b border-border px-4 py-3">
				<span className="flex-shrink-0 text-muted">{icon}</span>
				<h2 className="min-w-0 break-words text-sm font-bold text-foreground">
					{title}
				</h2>
			</div>
			<div className="p-4">{children}</div>
		</section>
	);
}

export function OrderDetailPage() {
	const search = Route.useSearch();
	const { orderId } = Route.useParams();
	const navigate = useNavigate();
	const isPaid = search.paid === true;

	const { data, isLoading } = useQuery(
		getCustomerOrderDetailQueryOptions({ orderId }),
	);
	const order = data?.data?.order ?? null;

	const trackingEnabled = !!order?.canTrack;
	const { data: trackingData } = useQuery({
		...getOrderTrackingQueryOptions({ orderId }),
		enabled: trackingEnabled,
	});
	const tracking = trackingData?.data ?? null;
	const { data: paymentData } = useQuery({
		...getPaymentQueryOptions({ orderId }),
		enabled: !!order,
	});
	const paymentDetail = paymentData?.data.payment ?? null;

	const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder();
	const { mutate: stripe, isPending: payingNow } = useCreateStripeCheckout();
	const { mutate: confirmPayment } = useConfirmPayment();
	const { mutate: reorder, isPending: reordering } = useReorderOrder({
		onSuccess: () => navigate({ to: "/cart" }),
	});

	const hasConfirmedReturn = useRef(false);
	useEffect(() => {
		if (!isPaid || hasConfirmedReturn.current) return;
		hasConfirmedReturn.current = true;
		// Returning from Stripe with ?paid=true: ask Stripe directly whether the
		// payment went through and reconcile it, so the order is confirmed even
		// when the webhook is delayed or unavailable.
		confirmPayment({ orderId });
		toast.success("Payment successful! Your order has been confirmed.");
	}, [isPaid, orderId, confirmPayment]);

	if (isLoading) {
		return (
			<div className="space-y-5">
				<Skeleton className="h-10 w-52 rounded-lg" />
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{[1, 2, 3, 4].map((item) => (
						<Skeleton key={item} className="h-28 rounded-lg" />
					))}
				</div>
				<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
					<Skeleton className="h-96 rounded-lg" />
					<Skeleton className="h-96 rounded-lg" />
				</div>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="rounded-lg border border-dashed border-border p-6 text-center sm:p-12">
				<p className="font-semibold text-foreground">Order not found</p>
				<LinkAnchor
					to="/account/orders"
					className="mt-2 block text-sm text-accent hover:underline"
				>
					Back to orders
				</LinkAnchor>
			</div>
		);
	}

	const orderStatusLabel = ORDER_STATUS_LABELS[order.status];
	const paymentStatusLabel = PAYMENT_STATUS_LABELS[order.payment.status];
	const shippingStatusLabel = labelFor(
		SHIPPING_STATUS_LABELS,
		order.shipping.status,
	);
	const shippingMethodLabel = labelFor(
		SHIPPING_METHOD_LABELS,
		order.shipping.method,
	);
	const paymentMethodLabel = labelFor(
		PAYMENT_METHOD_LABELS,
		order.payment.method,
	);

	return (
		<div className="min-w-0 space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0">
					<LinkAnchor
						to="/account/orders"
						className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
					>
						<ArrowLeft size={16} />
						Back to orders
					</LinkAnchor>
					<h1 className="break-words text-xl font-bold text-foreground sm:text-2xl">
						Order #{order.orderNumber}
					</h1>
					<p className="mt-1 text-sm text-muted">
						Placed {formatDateTime(order.placedAt)}
					</p>
				</div>

				<div className="flex flex-wrap gap-2 sm:justify-end">
					<Chip
						size="sm"
						color={ORDER_STATUS_COLORS[order.status]}
						variant="soft"
					>
						{orderStatusLabel}
					</Chip>
					<Chip
						size="sm"
						color={PAYMENT_STATUS_COLORS[order.payment.status]}
						variant="soft"
					>
						{paymentStatusLabel}
					</Chip>
				</div>
			</div>

			{isPaid ? (
				<div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 px-4 py-3">
					<CheckCircle
						size={16}
						className="mt-0.5 flex-shrink-0 text-success"
					/>
					<div>
						<p className="text-sm font-semibold text-success">
							Payment successful
						</p>
						<p className="text-xs text-success">
							Your payment was received and the order is now being processed.
						</p>
					</div>
				</div>
			) : null}

			<div className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-surface p-3 sm:flex sm:flex-wrap">
				{order.payment.status === "pending" ? (
					<Button
						variant="primary"
						size="sm"
						isPending={payingNow}
						onPress={() => stripe({ orderId: order.id })}
						className="w-full sm:w-auto"
					>
						<CreditCard size={14} />
						Pay now
					</Button>
				) : null}
				<Button
					variant="outline"
					size="sm"
					isPending={reordering}
					onPress={() => reorder({ orderId: order.id })}
					className="w-full sm:w-auto"
				>
					<RotateCcw size={14} />
					Reorder
				</Button>
				{order.canCancel ? (
					<Button
						variant="danger-soft"
						size="sm"
						isPending={cancelling}
						onPress={() => cancelOrder({ orderId: order.id })}
						className="w-full sm:w-auto"
					>
						<X size={14} />
						Cancel order
					</Button>
				) : null}
			</div>

			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<SummaryTile
					icon={<Hash size={15} />}
					label="Order"
					value={`#${order.orderNumber}`}
					caption={`${order.itemCount} ${order.itemCount === 1 ? "item" : "items"}`}
				/>
				<SummaryTile
					icon={<CalendarDays size={15} />}
					label="Placed"
					value={formatDate(order.placedAt)}
					caption={orderStatusLabel}
				/>
				<SummaryTile
					icon={<CreditCard size={15} />}
					label="Payment"
					value={paymentMethodLabel}
					caption={paymentStatusLabel}
				/>
				<SummaryTile
					icon={<Truck size={15} />}
					label="Shipping"
					value={shippingStatusLabel}
					caption={shippingMethodLabel}
				/>
			</div>

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
				<div className="space-y-6">
					<DetailSection
						icon={<Package size={15} />}
						title={`Items (${order.itemCount})`}
					>
						<div className="divide-y divide-border">
							{order.items.map((item) => (
								<div
									key={item.variantId}
									className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
								>
									{item.image ? (
										<img
											src={item.image}
											alt={item.productName}
											className="size-14 flex-shrink-0 rounded-lg object-cover"
										/>
									) : (
										<div className="flex size-14 flex-shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
											<Package size={16} className="text-muted" />
										</div>
									)}

									<div className="min-w-0 flex-1">
										<p className="break-words text-sm font-semibold text-foreground">
											{item.productName}
										</p>
										<p className="mt-1 text-xs text-muted">
											{item.variantName} x {item.quantity}
										</p>
										<p className="mt-1 break-all font-mono text-xs text-muted">
											{item.sku}
										</p>
										<div className="mt-2 flex flex-wrap items-end justify-between gap-2">
											<p className="text-xs text-muted">
												{formatCurrency(item.unitPrice)} each
											</p>
											<p className="text-sm font-bold text-foreground">
												{formatCurrency(item.totalPrice)}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</DetailSection>

					{tracking ? <OrderTrackingSection tracking={tracking} /> : null}
				</div>

				<div className="space-y-4 xl:sticky xl:top-24">
					<DetailSection icon={<ReceiptText size={15} />} title="Summary">
						<div className="space-y-3">
							<DetailRow
								label="Subtotal"
								value={formatCurrency(order.subtotal)}
							/>
							<DetailRow
								label="Shipping"
								value={
									order.shippingFee === 0
										? "Free"
										: formatCurrency(order.shippingFee)
								}
							/>
							<DetailRow label="Tax" value={formatCurrency(order.taxAmount)} />
							<div className="border-t border-border pt-3">
								<DetailRow
									label="Total"
									value={
										<span className="font-bold">
											{formatCurrency(order.totalAmount)}
										</span>
									}
								/>
							</div>
						</div>
					</DetailSection>

					<DetailSection icon={<MapPin size={15} />} title="Shipping address">
						<div className="space-y-1 text-sm text-muted">
							<p className="font-semibold text-foreground">
								{order.address.fullName}
							</p>
							<p>{order.address.phone}</p>
							<p>{order.address.street}</p>
							<p>
								{order.address.postalCode} {order.address.city}
								{order.address.state ? `, ${order.address.state}` : ""}
							</p>
							<p>{order.address.country}</p>
						</div>
					</DetailSection>

					<DetailSection icon={<Truck size={15} />} title="Shipping">
						<div className="space-y-3">
							<DetailRow
								label="Carrier"
								value={labelFor(
									SHIPPING_CARRIER_LABELS,
									order.shipping.carrier,
								)}
							/>
							<DetailRow label="Method" value={shippingMethodLabel} />
							<DetailRow label="Status" value={shippingStatusLabel} />
							<DetailRow
								label="Tracking"
								value={order.shipping.trackingNumber}
								mono
							/>
							<DetailRow
								label="Shipped"
								value={formatDate(order.shipping.shippedAt)}
							/>
							<DetailRow
								label="Delivered"
								value={formatDate(order.shipping.deliveredAt)}
							/>
						</div>
					</DetailSection>

					<DetailSection icon={<CreditCard size={15} />} title="Payment">
						<div className="space-y-3">
							<DetailRow label="Method" value={paymentMethodLabel} />
							<DetailRow label="Status" value={paymentStatusLabel} />
							<DetailRow
								label="Amount"
								value={formatCurrency(order.payment.amount)}
							/>
							<DetailRow
								label="Paid"
								value={formatDate(order.payment.paidAt)}
							/>
							{paymentDetail ? (
								<>
									<DetailRow label="Payment ID" value={paymentDetail.id} mono />
									{paymentDetail.stripe ? (
										<>
											<DetailRow
												label="Stripe"
												value={formatFallbackLabel(paymentDetail.stripe.status)}
											/>
											<DetailRow
												label="Currency"
												value={paymentDetail.stripe.currency.toUpperCase()}
											/>
											<DetailRow
												label="Session"
												value={paymentDetail.stripe.checkoutSessionId}
												mono
											/>
											<DetailRow
												label="Intent"
												value={paymentDetail.stripe.paymentIntentId}
												mono
											/>
										</>
									) : null}
								</>
							) : null}
						</div>
					</DetailSection>

					{order.notes ? (
						<DetailSection icon={<ReceiptText size={15} />} title="Notes">
							<p className="text-sm leading-6 text-muted">{order.notes}</p>
						</DetailSection>
					) : null}
				</div>
			</div>
		</div>
	);
}
