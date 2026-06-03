import { Button, Card, Skeleton } from "@heroui/react";
import { AlertCircle, Inbox, type LucideIcon, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

export function AdminPageHeader({
	title,
	description,
}: {
	title: string;
	description?: string;
}) {
	return (
		<div>
			<h1 className="text-2xl font-semibold text-foreground">{title}</h1>
			{description ? (
				<p className="text-sm text-muted mt-1">{description}</p>
			) : null}
		</div>
	);
}

export function AdminEmptyState({
	icon: Icon,
	message,
	title = "Nothing to show",
}: {
	icon?: LucideIcon;
	message: string;
	title?: string;
}) {
	const EmptyIcon = Icon ?? Inbox;

	return (
		<Card className="items-center justify-center gap-3 p-10 text-center">
			<EmptyIcon size={30} className="text-muted/50" />
			<Card.Header className="items-center gap-1 p-0">
				<Card.Title className="text-base">{title}</Card.Title>
			</Card.Header>
			<Card.Content className="p-0">
				<p className="text-sm text-muted">{message}</p>
			</Card.Content>
		</Card>
	);
}

export function AdminPlaceholderCard({ children }: { children: ReactNode }) {
	return (
		<Card className="h-52 items-center justify-center p-6 text-center">
			<Card.Content className="p-0">
				<p className="text-sm text-muted">{children}</p>
			</Card.Content>
		</Card>
	);
}

type AdminErrorProps = {
	actionLabel?: string;
	message?: string;
	onAction?: () => void;
	title?: string;
};

type SkeletonCountProps = {
	count?: number;
};

const TABLE_SKELETON_COLUMNS = [
	"product",
	"price",
	"stock",
	"status",
	"rating",
	"actions",
];
const METRIC_SKELETON_KEYS = ["first", "second", "third", "fourth"];

function getSkeletonKeys(prefix: string, count: number) {
	return Array.from({ length: count }, (_, index) => `${prefix}-${index + 1}`);
}

export function AdminPageLoading({
	message = "Loading page...",
}: {
	message?: string;
}) {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<Skeleton className="h-7 w-48 rounded" />
				<Skeleton className="h-4 w-72 rounded" />
			</div>
			<AdminSectionLoading message={message} />
		</div>
	);
}

export function AdminPageError({
	actionLabel = "Try again",
	message = "Something went wrong while loading this page.",
	onAction,
	title = "Page failed to load",
}: AdminErrorProps) {
	return (
		<Card className="items-center justify-center gap-3 p-10 text-center">
			<AlertCircle size={30} className="text-danger" />
			<Card.Header className="items-center gap-1 p-0">
				<Card.Title className="text-base">{title}</Card.Title>
				<Card.Description className="max-w-md">{message}</Card.Description>
			</Card.Header>
			{onAction ? (
				<Card.Footer className="p-0">
					<Button size="sm" variant="secondary" onPress={onAction}>
						<RefreshCw size={14} />
						{actionLabel}
					</Button>
				</Card.Footer>
			) : null}
		</Card>
	);
}

export function AdminSectionLoading({
	message = "Loading...",
}: {
	message?: string;
}) {
	return (
		<Card className="gap-4 p-4">
			<Card.Content className="flex flex-col gap-4 p-0">
				<div className="flex items-center justify-between gap-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-32 rounded" />
						<Skeleton className="h-3 w-48 rounded" />
					</div>
					<Skeleton className="h-8 w-24 rounded-lg" />
				</div>
				<AdminListSkeleton count={3} />
				<span className="sr-only">{message}</span>
			</Card.Content>
		</Card>
	);
}

export function AdminSectionError({
	actionLabel = "Retry",
	message = "This section could not be loaded.",
	onAction,
	title = "Section failed to load",
}: AdminErrorProps) {
	return (
		<Card className="border-danger/30 bg-danger/5 p-4">
			<Card.Content className="flex flex-col gap-3 p-0 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 items-start gap-3">
					<AlertCircle size={18} className="mt-0.5 shrink-0 text-danger" />
					<div className="min-w-0">
						<p className="text-sm font-medium text-foreground">{title}</p>
						<p className="mt-1 text-sm text-muted">{message}</p>
					</div>
				</div>
				{onAction ? (
					<Button size="sm" variant="secondary" onPress={onAction}>
						<RefreshCw size={14} />
						{actionLabel}
					</Button>
				) : null}
			</Card.Content>
		</Card>
	);
}

export function AdminTableSkeleton({ count = 6 }: SkeletonCountProps) {
	return (
		<Card className="overflow-hidden">
			<Card.Content className="p-0">
				<div className="grid grid-cols-[minmax(220px,1.8fr)_1fr_1fr_1.3fr_1fr_48px] gap-4 border-b border-border px-4 py-3">
					{TABLE_SKELETON_COLUMNS.map((column) => (
						<Skeleton key={column} className="h-3 rounded" />
					))}
				</div>
				<div className="divide-y divide-border">
					{getSkeletonKeys("table-row", count).map((rowKey) => (
						<div
							key={rowKey}
							className="grid grid-cols-[minmax(220px,1.8fr)_1fr_1fr_1.3fr_1fr_48px] items-center gap-4 px-4 py-3"
						>
							<div className="flex items-center gap-3">
								<Skeleton className="size-10 rounded-lg" />
								<div className="min-w-0 flex-1 space-y-2">
									<Skeleton className="h-4 w-4/5 rounded" />
									<Skeleton className="h-3 w-2/5 rounded" />
								</div>
							</div>
							<Skeleton className="h-4 w-16 rounded" />
							<Skeleton className="h-4 w-10 rounded" />
							<Skeleton className="h-5 w-24 rounded-full" />
							<Skeleton className="h-4 w-20 rounded" />
							<Skeleton className="size-8 rounded-lg" />
						</div>
					))}
				</div>
			</Card.Content>
		</Card>
	);
}

export function AdminCardGridSkeleton({ count = 6 }: SkeletonCountProps) {
	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
			{getSkeletonKeys("card", count).map((cardKey) => (
				<Card key={cardKey} className="min-h-[220px] p-4">
					<Card.Content className="flex flex-col gap-4 p-0">
						<div className="flex items-start justify-between gap-3">
							<div className="flex min-w-0 flex-1 items-center gap-3">
								<Skeleton className="size-16 rounded-xl" />
								<div className="min-w-0 flex-1 space-y-2">
									<Skeleton className="h-4 w-4/5 rounded" />
									<Skeleton className="h-3 w-2/5 rounded" />
								</div>
							</div>
							<Skeleton className="size-8 rounded-lg" />
						</div>
						<Skeleton className="h-5 w-40 rounded-full" />
						<div className="grid grid-cols-2 gap-4">
							{METRIC_SKELETON_KEYS.map((metricKey) => (
								<div key={metricKey} className="space-y-2">
									<Skeleton className="h-3 w-16 rounded" />
									<Skeleton className="h-4 w-24 rounded" />
								</div>
							))}
						</div>
					</Card.Content>
				</Card>
			))}
		</div>
	);
}

export function AdminListSkeleton({ count = 5 }: SkeletonCountProps) {
	return (
		<div className="flex flex-col gap-3">
			{getSkeletonKeys("list-row", count).map((rowKey) => (
				<Card key={rowKey}>
					<Card.Content className="p-4">
						<div className="flex flex-col gap-4 xl:flex-row xl:items-center">
							<div className="flex min-w-0 flex-1 items-center gap-3">
								<Skeleton className="size-12 rounded-xl" />
								<div className="min-w-0 flex-1 space-y-2">
									<Skeleton className="h-4 w-3/5 rounded" />
									<Skeleton className="h-3 w-2/5 rounded" />
								</div>
							</div>
							<div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4 xl:w-[520px]">
								{METRIC_SKELETON_KEYS.map((metricKey) => (
									<div key={metricKey} className="space-y-2">
										<Skeleton className="h-3 w-14 rounded" />
										<Skeleton className="h-4 w-20 rounded" />
									</div>
								))}
							</div>
							<Skeleton className="h-5 w-32 rounded-full" />
						</div>
					</Card.Content>
				</Card>
			))}
		</div>
	);
}
