import type { ShippingMethodType } from "../admin/admin.types";

export const ORDER_TAX_RATE = 0.19;

export const ORDER_SHIPPING_FEES = {
	standard: 0,
	express: 15,
	same_day: 25,
} satisfies Record<ShippingMethodType, number>;

export const roundOrderMoney = (amount: number): number => {
	return Number(amount.toFixed(2));
};
