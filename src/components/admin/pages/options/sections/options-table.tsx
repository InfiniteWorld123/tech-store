"use client";
import { Button, EmptyState, Table } from "@heroui/react";
import { Boxes, Pencil, Trash2 } from "lucide-react";
import type { OptionConfig, OptionRow } from "../option-configs";

type Props = {
	config: OptionConfig;
	rows: OptionRow[];
	hasSearch: boolean;
	onView: (row: OptionRow) => void;
	onEdit: (row: OptionRow) => void;
	onDelete: (row: OptionRow) => void;
};

function formatDate(value: string) {
	return new Date(value).toLocaleDateString();
}

export function OptionsTable({
	config,
	rows,
	hasSearch,
	onView,
	onEdit,
	onDelete,
}: Props) {
	if (rows.length === 0) {
		return (
			<EmptyState.Root className="py-16">
				<Boxes size={28} className="text-muted" />
				<p className="text-sm font-medium text-foreground">
					{hasSearch
						? `No ${config.plural} match your search`
						: `No ${config.plural} yet`}
				</p>
				<p className="text-xs text-muted">
					{hasSearch
						? "Try a different search term."
						: `Create your first ${config.singular} to get started.`}
				</p>
			</EmptyState.Root>
		);
	}

	return (
		<Table.Root>
			<Table.ScrollContainer>
				<Table.Content aria-label={config.plural}>
					<Table.Header>
						<Table.Column isRowHeader>Name</Table.Column>
						<Table.Column>{config.valueField.label}</Table.Column>
						<Table.Column>Created</Table.Column>
						<Table.Column>Updated</Table.Column>
						<Table.Column className="text-right">Actions</Table.Column>
					</Table.Header>
					<Table.Body items={rows}>
						{(row) => (
							<Table.Row
								id={row.id}
								onClick={() => onView(row)}
								className="cursor-pointer"
							>
								<Table.Cell className="font-medium text-foreground">
									{row.name}
								</Table.Cell>
								<Table.Cell>{config.renderValue(row)}</Table.Cell>
								<Table.Cell className="text-muted whitespace-nowrap">
									{formatDate(row.createdAt)}
								</Table.Cell>
								<Table.Cell className="text-muted whitespace-nowrap">
									{formatDate(row.updatedAt)}
								</Table.Cell>
								<Table.Cell>
									<div className="flex items-center justify-end gap-1">
										<Button
											isIconOnly
											size="sm"
											variant="ghost"
											onClick={(event) => event.stopPropagation()}
											onPress={() => onEdit(row)}
											aria-label={`Edit ${row.name}`}
											className="text-muted hover:text-foreground"
										>
											<Pencil size={15} />
										</Button>
										<Button
											isIconOnly
											size="sm"
											variant="ghost"
											onClick={(event) => event.stopPropagation()}
											onPress={() => onDelete(row)}
											aria-label={`Delete ${row.name}`}
											className="text-muted hover:text-danger"
										>
											<Trash2 size={15} />
										</Button>
									</div>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Content>
			</Table.ScrollContainer>
		</Table.Root>
	);
}

export function OptionsList({
	config,
	rows,
	hasSearch,
	onView,
	onEdit,
	onDelete,
}: Props) {
	if (rows.length === 0) {
		return (
			<EmptyState.Root className="py-16">
				<Boxes size={28} className="text-muted" />
				<p className="text-sm font-medium text-foreground">
					{hasSearch
						? `No ${config.plural} match your search`
						: `No ${config.plural} yet`}
				</p>
				<p className="text-xs text-muted">
					{hasSearch
						? "Try a different search term."
						: `Create your first ${config.singular} to get started.`}
				</p>
			</EmptyState.Root>
		);
	}

	return (
		<div className="divide-y divide-border">
			{rows.map((row) => (
				<div
					key={row.id}
					className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<button
						type="button"
						onClick={() => onView(row)}
						className="min-w-0 flex-1 text-left"
					>
						<p className="truncate text-sm font-semibold text-foreground">
							{row.name}
						</p>
						<div className="mt-1 text-sm text-muted">
							{config.renderValue(row)}
						</div>
					</button>
					<div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
						<span className="break-words text-xs text-muted">
							Updated {formatDate(row.updatedAt)}
						</span>
						<div className="flex items-center gap-1">
							<Button
								isIconOnly
								size="sm"
								variant="ghost"
								onClick={(event) => event.stopPropagation()}
								onPress={() => onEdit(row)}
								aria-label={`Edit ${row.name}`}
								className="text-muted hover:text-foreground"
							>
								<Pencil size={15} />
							</Button>
							<Button
								isIconOnly
								size="sm"
								variant="ghost"
								onClick={(event) => event.stopPropagation()}
								onPress={() => onDelete(row)}
								aria-label={`Delete ${row.name}`}
								className="text-muted hover:text-danger"
							>
								<Trash2 size={15} />
							</Button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export function OptionsCards({
	config,
	rows,
	hasSearch,
	onView,
	onEdit,
	onDelete,
}: Props) {
	if (rows.length === 0) {
		return (
			<EmptyState.Root className="py-16">
				<Boxes size={28} className="text-muted" />
				<p className="text-sm font-medium text-foreground">
					{hasSearch
						? `No ${config.plural} match your search`
						: `No ${config.plural} yet`}
				</p>
				<p className="text-xs text-muted">
					{hasSearch
						? "Try a different search term."
						: `Create your first ${config.singular} to get started.`}
				</p>
			</EmptyState.Root>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
			{rows.map((row) => (
				<div
					key={row.id}
					className="rounded-2xl border border-border bg-default/30 p-4"
				>
					<div className="flex min-w-0 flex-col gap-3 min-[360px]:flex-row min-[360px]:items-start min-[360px]:justify-between">
						<button
							type="button"
							onClick={() => onView(row)}
							className="min-w-0 flex-1 text-left"
						>
							<p className="break-words text-sm font-semibold text-foreground">
								{row.name}
							</p>
							<div className="mt-2 break-words text-sm text-muted">
								{config.renderValue(row)}
							</div>
						</button>
						<div className="flex shrink-0 items-center gap-1">
							<Button
								isIconOnly
								size="sm"
								variant="ghost"
								onClick={(event) => event.stopPropagation()}
								onPress={() => onEdit(row)}
								aria-label={`Edit ${row.name}`}
								className="text-muted hover:text-foreground"
							>
								<Pencil size={15} />
							</Button>
							<Button
								isIconOnly
								size="sm"
								variant="ghost"
								onClick={(event) => event.stopPropagation()}
								onPress={() => onDelete(row)}
								aria-label={`Delete ${row.name}`}
								className="text-muted hover:text-danger"
							>
								<Trash2 size={15} />
							</Button>
						</div>
					</div>
					<p className="mt-4 break-words text-xs text-muted">
						Updated {formatDate(row.updatedAt)}
					</p>
				</div>
			))}
		</div>
	);
}
