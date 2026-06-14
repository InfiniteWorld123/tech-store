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
import { useEffect } from "react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useCancelOrder } from "#/mutations/orders/use-cancel-order";
import { useCreateStripeCheckout } from "#/mutations/orders/use-create-stripe-checkout";
import { useReorderOrder } from "#/mutations/orders/use-reorder-order";
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

function orderStatusColor(
	status: OrderStatusType,
): "default" | "accent" | "success" | "danger" | "warning" {
	switch (status) {
		case "pending":
		case "processing":
			return "accent";
		case "completed":
			return "success";
		case "cancelled":
			return "danger";
		default:
			return "default";
	}
}

function paymentStatusColor(
	status: PaymentStatusType,
): "default" | "accent" | "success" | "danger" | "warning" {
	switch (status) {
		case "paid":
			return "success";
		case "failed":
			return "danger";
		case "refunded":
			return "warning";
		default:
			return "default";
	}
}

const formatCurrency = (amount: number) =>
	`€${amount.toLocaleString("en-DE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;

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

const formatLabel = (value: string | null | undefined) =>
	value ? value.replaceAll("_", " ") : "—";

function DetailRow({
	label,
	value,
	mono,
}: {
	label: string;
	value: string | number | null | undefined;
	mono?: boolean;
}) {
	return (
		<div className="flex justify-between gap-3 text-xs">
			<span className="text-muted">{label}</span>
			<span
				className={`text-foreground text-right break-all ${mono ? "font-mono" : ""}`}
			>
				{value ?? "—"}
			</span>
		</div>
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
	const { mutate: reorder, isPending: reordering } = useReorderOrder({
		onSuccess: () => navigate({ to: "/cart" }),
	});

	useEffect(() => {
		if (isPaid) {
			toast.success("Payment successful! Your order has been confirmed.");
		}
	}, [isPaid]);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-10 w-48 rounded-xl" />
				<Skeleton className="h-40 rounded-2xl" />
				<Skeleton className="h-40 rounded-2xl" />
			</div>
		);
	}

	if (!order) {
		return (
			<div className="text-center py-20">
				<p className="text-foreground font-semibold">Order not found</p>
				<LinkAnchor
					to="/account/orders"
					className="text-sm text-accent hover:underline mt-2 block"
				>
					Back to orders
				</LinkAnchor>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Back + title */}
			<div className="flex items-center gap-3">
				<LinkAnchor
					to="/account/orders"
					className="text-muted hover:text-foreground transition-colors"
				>
					<ArrowLeft size={18} />
				</LinkAnchor>
				<div>
					<h1 className="text-xl font-bold text-foreground">
						Order #{order.orderNumber}
					</h1>
					<p className="text-xs text-muted">
						Placed{" "}
						{new Date(order.placedAt).toLocaleDateString("en-DE", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
				</div>
				<div className="ml-auto flex items-center gap-2">
					<Chip size="sm" color={orderStatusColor(order.status)} variant="soft">
						{order.status}
					</Chip>
					<Chip
						size="sm"
						color={paymentStatusColor(order.payment.status)}
						variant="soft"
					>
						{order.payment.status}
					</Chip>
				</div>
			</div>

			{/* Payment success banner */}
			{isPaid && (
				<div className="flex items-center gap-3 px-4 py-3 bg-success/10 border border-success/30 rounded-2xl">
					<CheckCircle size={16} className="text-success flex-shrink-0" />
					<p className="text-sm text-success font-medium">
						Payment successful! Your order is being processed.
					</p>
				</div>
			)}

			{/* Actions */}
			<div className="flex flex-wrap gap-2">
				{order.payment.status === "pending" && (
					<Button
						variant="primary"
						size="sm"
						isPending={payingNow}
						onPress={() => stripe({ orderId: order.id })}
					>
						<CreditCard size={14} />
						Pay now
					</Button>
				)}
				<Button
					variant="outline"
					size="sm"
					isPending={reordering}
					onPress={() => reorder({ orderId: order.id })}
				>
					<RotateCcw size={14} />
					Reorder
				</Button>
				{order.canCancel && (
					<Button
						variant="danger-soft"
						size="sm"
						isPending={cancelling}
						onPress={() => cancelOrder({ orderId: order.id })}
					>
						<X size={14} />
						Cancel order
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				<div className="border border-border rounded-2xl p-4 space-y-2">
					<p className="text-xs font-semibold text-muted uppercase tracking-widest flex items-center gap-2">
						<Hash size={13} />
						Order
					</p>
					<p className="text-sm font-bold text-foreground">
						#{order.orderNumber}
					</p>
					<DetailRow label="Order ID" value={order.id} mono />
				</div>
				<div className="border border-border rounded-2xl p-4 space-y-2">
					<p className="text-xs font-semibold text-muted uppercase tracking-widest flex items-center gap-2">
						<CalendarDays size={13} />
						Placed
					</p>
					<p className="text-sm font-bold text-foreground">
						{formatDateTime(order.placedAt)}
					</p>
					<DetailRow label="Items" value={order.itemCount} />
				</div>
				<div className="border border-border rounded-2xl p-4 space-y-2">
					<p className="text-xs font-semibold text-muted uppercase tracking-widest flex items-center gap-2">
						<CreditCard size={13} />
						Payment
					</p>
					<p className="text-sm font-bold text-foreground">
						{formatLabel(order.payment.method)}
					</p>
					<DetailRow
						label="Amount"
						value={formatCurrency(order.payment.amount)}
					/>
				</div>
				<div className="border border-border rounded-2xl p-4 space-y-2">
					<p className="text-xs font-semibold text-muted uppercase tracking-widest flex items-center gap-2">
						<Truck size={13} />
						Shipping
					</p>
					<p className="text-sm font-bold text-foreground">
						{formatLabel(order.shipping.status)}
					</p>
					<DetailRow
						label="Method"
						value={formatLabel(order.shipping.method)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Items */}
				<div className="border border-border rounded-2xl overflow-hidden">
					<div className="px-4 py-3 border-b border-border bg-surface-secondary">
						<p className="text-sm font-bold text-foreground flex items-center gap-2">
							<Package size={14} />
							Items ({order.itemCount})
						</p>
					</div>
					<div className="divide-y divide-border">
						{order.items.map((item) => (
							<div key={item.variantId} className="flex gap-3 p-4">
								{item.image && (
									<img
										src={item.image}
										alt={item.productName}
										className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
									/>
								)}
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-foreground truncate">
										{item.productName}
									</p>
									<p className="text-xs text-muted">
										{item.variantName} × {item.quantity}
									</p>
									<p className="text-xs text-muted font-mono">{item.sku}</p>
									<p className="text-xs text-muted">
										{formatCurrency(item.unitPrice)} each
									</p>
								</div>
								<p className="text-sm font-bold text-foreground flex-shrink-0">
									{formatCurrency(item.totalPrice)}
								</p>
							</div>
						))}
					</div>
					{/* Totals */}
					<div className="px-4 py-3 border-t border-border space-y-1.5 text-sm">
						<div className="flex justify-between text-muted">
							<span>Subtotal</span>
							<span>{formatCurrency(order.subtotal)}</span>
						</div>
						<div className="flex justify-between text-muted">
							<span>Shipping</span>
							<span>
								{order.shippingFee === 0
									? "Free"
									: formatCurrency(order.shippingFee)}
							</span>
						</div>
						<div className="flex justify-between text-muted">
							<span>Tax</span>
							<span>{formatCurrency(order.taxAmount)}</span>
						</div>
						<div className="flex justify-between font-bold text-foreground pt-1 border-t border-border">
							<span>Total</span>
							<span>{formatCurrency(order.totalAmount)}</span>
						</div>
					</div>
				</div>

				{/* Info cards */}
				<div className="space-y-4">
					{/* Shipping address */}
					<div className="border border-border rounded-2xl p-4 space-y-2">
						<p className="text-sm font-bold text-foreground flex items-center gap-2">
							<MapPin size={14} />
							Shipping address
						</p>
						<div className="text-xs text-muted space-y-0.5">
							<p className="font-medium text-foreground">
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
					</div>

					{/* Shipping info */}
					<div className="border border-border rounded-2xl p-4 space-y-3">
						<p className="text-sm font-bold text-foreground flex items-center gap-2">
							<Truck size={14} />
							Shipping
						</p>
						<div className="space-y-2">
							<DetailRow
								label="Carrier"
								value={formatLabel(order.shipping.carrier)}
							/>
							<DetailRow
								label="Method"
								value={formatLabel(order.shipping.method)}
							/>
							<DetailRow
								label="Status"
								value={formatLabel(order.shipping.status)}
							/>
							<DetailRow
								label="Tracking #"
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
					</div>

					{/* Payment info */}
					<div className="border border-border rounded-2xl p-4 space-y-3">
						<p className="text-sm font-bold text-foreground flex items-center gap-2">
							<CreditCard size={14} />
							Payment
						</p>
						<div className="space-y-2">
							<DetailRow
								label="Method"
								value={formatLabel(order.payment.method)}
							/>
							<DetailRow
								label="Status"
								value={formatLabel(order.payment.status)}
							/>
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
												label="Stripe status"
												value={paymentDetail.stripe.status}
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
					</div>

					{/* Notes */}
					{order.notes && (
						<div className="border border-border rounded-2xl p-4 space-y-2">
							<p className="text-sm font-bold text-foreground flex items-center gap-2">
								<ReceiptText size={14} />
								Notes
							</p>
							<p className="text-xs text-muted">{order.notes}</p>
						</div>
					)}
				</div>
			</div>

			{/* Tracking */}
			{tracking && <OrderTrackingSection tracking={tracking} />}
		</div>
	);
}
