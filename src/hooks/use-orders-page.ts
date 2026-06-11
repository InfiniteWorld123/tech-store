import { useEffect, useMemo, useState } from "react";
import type { AdminOrderListItemType } from "#/server/orders/admin/admin.types";

const MOCK_ORDERS: AdminOrderListItemType[] = [
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380001",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380001",
		orderNumber: "ORD-20240115-A1B2C3",
		status: "pending",
		subtotal: 89.99,
		shippingFee: 0,
		taxAmount: 17.1,
		totalAmount: 107.09,
		notes: null,
		placedAt: "2024-01-15T10:30:00.000Z",
		createdAt: "2024-01-15T10:30:00.000Z",
		updatedAt: "2024-01-15T10:30:00.000Z",
		customer: { id: "c001", name: "Alice Johnson", email: "alice@example.com" },
		payment: {
			id: "p001",
			method: "card",
			status: "pending",
			amount: 107.09,
			paidAt: null,
		},
		shipping: {
			id: "s001",
			carrier: "dhl",
			method: "standard",
			status: "pending",
			trackingNumber: null,
		},
		itemCount: 2,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380002",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380002",
		orderNumber: "ORD-20240128-D4E5F6",
		status: "pending",
		subtotal: 145.5,
		shippingFee: 15,
		taxAmount: 27.65,
		totalAmount: 188.15,
		notes: null,
		placedAt: "2024-01-28T14:15:00.000Z",
		createdAt: "2024-01-28T14:15:00.000Z",
		updatedAt: "2024-01-28T14:15:00.000Z",
		customer: { id: "c002", name: "Bob Smith", email: "bob@example.com" },
		payment: {
			id: "p002",
			method: "paypal",
			status: "paid",
			amount: 188.15,
			paidAt: "2024-01-28T14:20:00.000Z",
		},
		shipping: {
			id: "s002",
			carrier: "fedex",
			method: "express",
			status: "packed",
			trackingNumber: null,
		},
		itemCount: 3,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380003",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380003",
		orderNumber: "ORD-20240210-G7H8I9",
		status: "processing",
		subtotal: 229.0,
		shippingFee: 0,
		taxAmount: 43.51,
		totalAmount: 272.51,
		notes: null,
		placedAt: "2024-02-10T09:00:00.000Z",
		createdAt: "2024-02-10T09:00:00.000Z",
		updatedAt: "2024-02-12T11:00:00.000Z",
		customer: { id: "c003", name: "Carol Davis", email: "carol@example.com" },
		payment: {
			id: "p003",
			method: "card",
			status: "paid",
			amount: 272.51,
			paidAt: "2024-02-10T09:05:00.000Z",
		},
		shipping: {
			id: "s003",
			carrier: "ups",
			method: "standard",
			status: "shipped",
			trackingNumber: "1Z999AA1012345678",
		},
		itemCount: 5,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380004",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380004",
		orderNumber: "ORD-20240220-J1K2L3",
		status: "processing",
		subtotal: 67.99,
		shippingFee: 15,
		taxAmount: 12.92,
		totalAmount: 95.91,
		notes: null,
		placedAt: "2024-02-20T16:45:00.000Z",
		createdAt: "2024-02-20T16:45:00.000Z",
		updatedAt: "2024-02-22T08:00:00.000Z",
		customer: { id: "c004", name: "David Lee", email: "david@example.com" },
		payment: {
			id: "p004",
			method: "bank_transfer",
			status: "paid",
			amount: 95.91,
			paidAt: "2024-02-21T10:00:00.000Z",
		},
		shipping: {
			id: "s004",
			carrier: "hermes",
			method: "express",
			status: "in_transit",
			trackingNumber: "JD014600006821401",
		},
		itemCount: 1,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380005",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380005",
		orderNumber: "ORD-20240305-M4N5O6",
		status: "processing",
		subtotal: 189.95,
		shippingFee: 25,
		taxAmount: 36.09,
		totalAmount: 251.04,
		notes: "Please leave at door",
		placedAt: "2024-03-05T11:30:00.000Z",
		createdAt: "2024-03-05T11:30:00.000Z",
		updatedAt: "2024-03-05T11:30:00.000Z",
		customer: { id: "c005", name: "Emma Wilson", email: "emma@example.com" },
		payment: {
			id: "p005",
			method: "cash_on_delivery",
			status: "pending",
			amount: 251.04,
			paidAt: null,
		},
		shipping: {
			id: "s005",
			carrier: "dhl",
			method: "same_day",
			status: "pending",
			trackingNumber: null,
		},
		itemCount: 4,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380006",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380006",
		orderNumber: "ORD-20240318-P7Q8R9",
		status: "completed",
		subtotal: 54.99,
		shippingFee: 0,
		taxAmount: 10.45,
		totalAmount: 65.44,
		notes: null,
		placedAt: "2024-03-18T08:20:00.000Z",
		createdAt: "2024-03-18T08:20:00.000Z",
		updatedAt: "2024-03-25T14:00:00.000Z",
		customer: { id: "c006", name: "Frank Brown", email: "frank@example.com" },
		payment: {
			id: "p006",
			method: "card",
			status: "paid",
			amount: 65.44,
			paidAt: "2024-03-18T08:22:00.000Z",
		},
		shipping: {
			id: "s006",
			carrier: "fedex",
			method: "standard",
			status: "delivered",
			trackingNumber: "4207200192748900111899223523",
		},
		itemCount: 2,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380007",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380007",
		orderNumber: "ORD-20240402-S1T2U3",
		status: "completed",
		subtotal: 312.0,
		shippingFee: 15,
		taxAmount: 59.28,
		totalAmount: 386.28,
		notes: null,
		placedAt: "2024-04-02T13:00:00.000Z",
		createdAt: "2024-04-02T13:00:00.000Z",
		updatedAt: "2024-04-10T16:00:00.000Z",
		customer: { id: "c007", name: "Grace Miller", email: "grace@example.com" },
		payment: {
			id: "p007",
			method: "paypal",
			status: "paid",
			amount: 386.28,
			paidAt: "2024-04-02T13:03:00.000Z",
		},
		shipping: {
			id: "s007",
			carrier: "dhl",
			method: "express",
			status: "delivered",
			trackingNumber: "DHL1234567890",
		},
		itemCount: 7,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380008",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380008",
		orderNumber: "ORD-20240415-V4W5X6",
		status: "completed",
		subtotal: 78.5,
		shippingFee: 25,
		taxAmount: 14.92,
		totalAmount: 118.42,
		notes: null,
		placedAt: "2024-04-15T17:30:00.000Z",
		createdAt: "2024-04-15T17:30:00.000Z",
		updatedAt: "2024-04-16T12:00:00.000Z",
		customer: { id: "c008", name: "Henry Taylor", email: "henry@example.com" },
		payment: {
			id: "p008",
			method: "card",
			status: "paid",
			amount: 118.42,
			paidAt: "2024-04-15T17:32:00.000Z",
		},
		shipping: {
			id: "s008",
			carrier: "ups",
			method: "same_day",
			status: "delivered",
			trackingNumber: "1ZR45V870310475628",
		},
		itemCount: 2,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380009",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380009",
		orderNumber: "ORD-20240501-Y7Z8A9",
		status: "cancelled",
		subtotal: 49.99,
		shippingFee: 0,
		taxAmount: 9.5,
		totalAmount: 59.49,
		notes: null,
		placedAt: "2024-05-01T10:00:00.000Z",
		createdAt: "2024-05-01T10:00:00.000Z",
		updatedAt: "2024-05-01T11:00:00.000Z",
		customer: { id: "c009", name: "Iris Anderson", email: "iris@example.com" },
		payment: {
			id: "p009",
			method: "card",
			status: "failed",
			amount: 59.49,
			paidAt: null,
		},
		shipping: {
			id: "s009",
			carrier: "hermes",
			method: "standard",
			status: "pending",
			trackingNumber: null,
		},
		itemCount: 1,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380010",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380010",
		orderNumber: "ORD-20240512-B1C2D3",
		status: "cancelled",
		subtotal: 199.0,
		shippingFee: 15,
		taxAmount: 37.81,
		totalAmount: 251.81,
		notes: null,
		placedAt: "2024-05-12T15:20:00.000Z",
		createdAt: "2024-05-12T15:20:00.000Z",
		updatedAt: "2024-05-13T09:00:00.000Z",
		customer: { id: "c010", name: "Jack Thompson", email: "jack@example.com" },
		payment: {
			id: "p010",
			method: "paypal",
			status: "refunded",
			amount: 251.81,
			paidAt: "2024-05-12T15:22:00.000Z",
		},
		shipping: {
			id: "s010",
			carrier: "fedex",
			method: "express",
			status: "pending",
			trackingNumber: null,
		},
		itemCount: 3,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380011",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380011",
		orderNumber: "ORD-20240528-E4F5G6",
		status: "pending",
		subtotal: 125.0,
		shippingFee: 0,
		taxAmount: 23.75,
		totalAmount: 148.75,
		notes: null,
		placedAt: "2024-05-28T09:45:00.000Z",
		createdAt: "2024-05-28T09:45:00.000Z",
		updatedAt: "2024-05-28T09:45:00.000Z",
		customer: { id: "c011", name: "Kate Martinez", email: "kate@example.com" },
		payment: {
			id: "p011",
			method: "bank_transfer",
			status: "paid",
			amount: 148.75,
			paidAt: "2024-05-28T10:30:00.000Z",
		},
		shipping: {
			id: "s011",
			carrier: "ups",
			method: "standard",
			status: "packed",
			trackingNumber: null,
		},
		itemCount: 2,
	},
	{
		id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
		userId: "u0eebc99-9c0b-4ef8-bb6d-6bb9bd380012",
		addressId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380012",
		orderNumber: "ORD-20240608-H7I8J9",
		status: "processing",
		subtotal: 95.0,
		shippingFee: 15,
		taxAmount: 18.05,
		totalAmount: 128.05,
		notes: "Gift wrapping requested",
		placedAt: "2024-06-08T12:10:00.000Z",
		createdAt: "2024-06-08T12:10:00.000Z",
		updatedAt: "2024-06-08T12:10:00.000Z",
		customer: { id: "c012", name: "Liam Johnson", email: "liam@example.com" },
		payment: {
			id: "p012",
			method: "card",
			status: "paid",
			amount: 128.05,
			paidAt: "2024-06-08T12:12:00.000Z",
		},
		shipping: {
			id: "s012",
			carrier: "dhl",
			method: "express",
			status: "packed",
			trackingNumber: null,
		},
		itemCount: 3,
	},
];

const LIMIT = 10;

export function useOrdersPage() {
	const [inputValue, setInputValue] = useState("");
	const [search, setSearch] = useState<string | undefined>();
	const [orderStatus, setOrderStatus] = useState("");
	const [paymentStatus, setPaymentStatus] = useState("");
	const [shippingStatus, setShippingStatus] = useState("");
	const [carrier, setCarrier] = useState("");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [page, setPageState] = useState(1);

	useEffect(() => {
		const t = window.setTimeout(() => {
			setSearch(inputValue.trim() || undefined);
			setPageState(1);
		}, 400);
		return () => window.clearTimeout(t);
	}, [inputValue]);

	const filtered = useMemo(() => {
		return MOCK_ORDERS.filter((o) => {
			if (orderStatus && o.status !== orderStatus) return false;
			if (paymentStatus && o.payment.status !== paymentStatus) return false;
			if (shippingStatus && o.shipping.status !== shippingStatus) return false;
			if (carrier && o.shipping.carrier !== carrier) return false;
			if (dateFrom && o.placedAt.slice(0, 10) < dateFrom) return false;
			if (dateTo && o.placedAt.slice(0, 10) > dateTo) return false;
			if (search) {
				const q = search.toLowerCase();
				return (
					o.orderNumber.toLowerCase().includes(q) ||
					o.customer.name.toLowerCase().includes(q) ||
					o.customer.email.toLowerCase().includes(q)
				);
			}
			return true;
		});
	}, [
		orderStatus,
		paymentStatus,
		shippingStatus,
		carrier,
		dateFrom,
		dateTo,
		search,
	]);

	const total = filtered.length;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));
	const safePage = Math.min(page, totalPages);
	const items = filtered.slice((safePage - 1) * LIMIT, safePage * LIMIT);

	const setPage = (p: number) => setPageState(p);

	return {
		inputValue,
		setInputValue,
		orderStatus,
		setOrderStatus: (v: string) => {
			setOrderStatus(v);
			setPageState(1);
		},
		paymentStatus,
		setPaymentStatus: (v: string) => {
			setPaymentStatus(v);
			setPageState(1);
		},
		shippingStatus,
		setShippingStatus: (v: string) => {
			setShippingStatus(v);
			setPageState(1);
		},
		carrier,
		setCarrier: (v: string) => {
			setCarrier(v);
			setPageState(1);
		},
		dateFrom,
		setDateFrom: (v: string) => {
			setDateFrom(v);
			setPageState(1);
		},
		dateTo,
		setDateTo: (v: string) => {
			setDateTo(v);
			setPageState(1);
		},
		page: safePage,
		setPage,
		items,
		pagination: {
			page: safePage,
			limit: LIMIT,
			total,
			totalPages,
			hasNextPage: safePage < totalPages,
			hasPreviousPage: safePage > 1,
		},
		isLoading: false as const,
		isError: false as const,
	};
}
