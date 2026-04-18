import { HttpStatusCode } from "./http";

export type JsonOk<T> = {
	success: true;
	status: HttpStatusCode;
	message: string;
	data: T;
};

export type JsonError = {
	success: false;
	status: HttpStatusCode;
	message: string;
	code?: string;
	details?: unknown;
};

export const jsonOk = <T>({
	data,
	status,
	message,
}: {
	data: T;
	status?: HttpStatusCode;
	message?: string;
}): JsonOk<T> => {
	return {
		success: true,
		message: message ?? "Success",
		status: status ?? HttpStatusCode.OK,
		data,
	};
};

export const jsonError = ({
	message,
	status,
	code,
	details,
}: {
	message: string;
	status?: HttpStatusCode;
	code?: string;
	details?: unknown;
}): JsonError => {
	return {
		success: false,
		status: status ?? HttpStatusCode.BAD_REQUEST,
		message,
		code,
		details,
	};
};
