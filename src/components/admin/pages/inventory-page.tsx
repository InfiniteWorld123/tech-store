"use client";

import {
	Button,
	Card,
	Chip,
	Dropdown,
	InputGroup,
	Label,
	ListBox,
	Modal,
	NumberField,
	Select,
	Table,
	Tabs,
	TextField,
} from "@heroui/react";
import {
	Database,
	HardDrive,
	type LucideIcon,
	MemoryStick,
	Monitor,
	MoreHorizontal,
	Palette,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useState } from "react";

type OptionKind = "colors" | "storage" | "ram" | "screens";

type BaseOption = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	usageCount: number;
};

type ColorOption = BaseOption & {
	kind: "colors";
	hexCode: string | null;
};

type StorageOption = BaseOption & {
	kind: "storage";
	valueGb: number;
};

type RamOption = BaseOption & {
	kind: "ram";
	valueGb: number;
};

type ScreenOption = BaseOption & {
	kind: "screens";
	valueInches: number;
};

type CatalogOption = ColorOption | StorageOption | RamOption | ScreenOption;

type OptionModalState = {
	kind: OptionKind;
	mode: "create" | "edit";
	option: CatalogOption | null;
};

const SEARCH_TYPES = [
	{ id: "name", label: "Name" },
	{ id: "value", label: "Value" },
];

const MOCK_COLORS: ColorOption[] = [
	{
		id: "color_space_black",
		kind: "colors",
		name: "Space Black",
		hexCode: "#1F2024",
		usageCount: 18,
		createdAt: "2026-02-10T10:00:00.000Z",
		updatedAt: "2026-05-30T12:00:00.000Z",
	},
	{
		id: "color_natural_titanium",
		kind: "colors",
		name: "Natural Titanium",
		hexCode: "#C2B8AA",
		usageCount: 12,
		createdAt: "2026-02-12T10:00:00.000Z",
		updatedAt: "2026-05-28T12:00:00.000Z",
	},
	{
		id: "color_graphite",
		kind: "colors",
		name: "Graphite",
		hexCode: "#4B4B4F",
		usageCount: 9,
		createdAt: "2026-02-13T10:00:00.000Z",
		updatedAt: "2026-05-24T12:00:00.000Z",
	},
	{
		id: "color_porcelain",
		kind: "colors",
		name: "Porcelain",
		hexCode: "#F1ECE4",
		usageCount: 6,
		createdAt: "2026-02-14T10:00:00.000Z",
		updatedAt: "2026-05-18T12:00:00.000Z",
	},
	{
		id: "color_midnight_blue",
		kind: "colors",
		name: "Midnight Blue",
		hexCode: "#27364A",
		usageCount: 4,
		createdAt: "2026-02-15T10:00:00.000Z",
		updatedAt: "2026-05-12T12:00:00.000Z",
	},
];

const MOCK_STORAGE: StorageOption[] = [
	{
		id: "storage_256",
		kind: "storage",
		name: "256 GB",
		valueGb: 256,
		usageCount: 24,
		createdAt: "2026-01-18T09:00:00.000Z",
		updatedAt: "2026-05-20T12:00:00.000Z",
	},
	{
		id: "storage_512",
		kind: "storage",
		name: "512 GB",
		valueGb: 512,
		usageCount: 31,
		createdAt: "2026-01-18T09:10:00.000Z",
		updatedAt: "2026-05-21T12:00:00.000Z",
	},
	{
		id: "storage_1024",
		kind: "storage",
		name: "1 TB",
		valueGb: 1024,
		usageCount: 17,
		createdAt: "2026-01-18T09:20:00.000Z",
		updatedAt: "2026-05-22T12:00:00.000Z",
	},
	{
		id: "storage_2048",
		kind: "storage",
		name: "2 TB",
		valueGb: 2048,
		usageCount: 5,
		createdAt: "2026-01-18T09:30:00.000Z",
		updatedAt: "2026-05-23T12:00:00.000Z",
	},
];

const MOCK_RAM: RamOption[] = [
	{
		id: "ram_8",
		kind: "ram",
		name: "8 GB",
		valueGb: 8,
		usageCount: 18,
		createdAt: "2026-01-20T09:00:00.000Z",
		updatedAt: "2026-05-20T12:00:00.000Z",
	},
	{
		id: "ram_16",
		kind: "ram",
		name: "16 GB",
		valueGb: 16,
		usageCount: 36,
		createdAt: "2026-01-20T09:10:00.000Z",
		updatedAt: "2026-05-21T12:00:00.000Z",
	},
	{
		id: "ram_24",
		kind: "ram",
		name: "24 GB",
		valueGb: 24,
		usageCount: 11,
		createdAt: "2026-01-20T09:20:00.000Z",
		updatedAt: "2026-05-22T12:00:00.000Z",
	},
	{
		id: "ram_32",
		kind: "ram",
		name: "32 GB",
		valueGb: 32,
		usageCount: 8,
		createdAt: "2026-01-20T09:30:00.000Z",
		updatedAt: "2026-05-23T12:00:00.000Z",
	},
];

const MOCK_SCREENS: ScreenOption[] = [
	{
		id: "screen_63",
		kind: "screens",
		name: "6.3 inch",
		valueInches: 6.3,
		usageCount: 14,
		createdAt: "2026-01-22T09:00:00.000Z",
		updatedAt: "2026-05-20T12:00:00.000Z",
	},
	{
		id: "screen_68",
		kind: "screens",
		name: "6.8 inch",
		valueInches: 6.8,
		usageCount: 9,
		createdAt: "2026-01-22T09:10:00.000Z",
		updatedAt: "2026-05-21T12:00:00.000Z",
	},
	{
		id: "screen_142",
		kind: "screens",
		name: "14.2 inch",
		valueInches: 14.2,
		usageCount: 15,
		createdAt: "2026-01-22T09:20:00.000Z",
		updatedAt: "2026-05-22T12:00:00.000Z",
	},
	{
		id: "screen_160",
		kind: "screens",
		name: "16 inch",
		valueInches: 16,
		usageCount: 7,
		createdAt: "2026-01-22T09:30:00.000Z",
		updatedAt: "2026-05-23T12:00:00.000Z",
	},
];

const OPTIONS_BY_KIND = {
	colors: MOCK_COLORS,
	storage: MOCK_STORAGE,
	ram: MOCK_RAM,
	screens: MOCK_SCREENS,
} satisfies Record<OptionKind, CatalogOption[]>;

const OPTION_META = {
	colors: {
		title: "Colors",
		description: "Reusable color names and hex codes",
		addLabel: "Add Color",
		valueLabel: "Hex Code",
		Icon: Palette,
	},
	storage: {
		title: "Storage",
		description: "Reusable storage capacity values",
		addLabel: "Add Storage",
		valueLabel: "Value GB",
		Icon: HardDrive,
	},
	ram: {
		title: "RAM",
		description: "Reusable memory capacity values",
		addLabel: "Add RAM",
		valueLabel: "Value GB",
		Icon: MemoryStick,
	},
	screens: {
		title: "Screen Sizes",
		description: "Reusable screen size values",
		addLabel: "Add Screen",
		valueLabel: "Value Inches",
		Icon: Monitor,
	},
} satisfies Record<
	OptionKind,
	{
		title: string;
		description: string;
		addLabel: string;
		valueLabel: string;
		Icon: LucideIcon;
	}
>;

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

function getOptionValue(option: CatalogOption) {
	if (option.kind === "colors") return option.hexCode ?? "No hex";
	if (option.kind === "screens") return `${option.valueInches} inch`;

	return `${option.valueGb} GB`;
}

function getOptionCount(kind: OptionKind) {
	return OPTIONS_BY_KIND[kind].length;
}

function OptionStats() {
	const stats = [
		{ kind: "colors", colorClass: "text-accent", bgClass: "bg-accent/10" },
		{ kind: "storage", colorClass: "text-success", bgClass: "bg-success/10" },
		{ kind: "ram", colorClass: "text-warning", bgClass: "bg-warning/10" },
		{ kind: "screens", colorClass: "text-danger", bgClass: "bg-danger/10" },
	] satisfies Array<{
		kind: OptionKind;
		colorClass: string;
		bgClass: string;
	}>;

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{stats.map((stat) => {
				const meta = OPTION_META[stat.kind];

				return (
					<Card key={stat.kind}>
						<Card.Content className="flex items-center gap-4 p-4">
							<div className={`rounded-xl p-2.5 ${stat.bgClass}`}>
								<meta.Icon size={20} className={stat.colorClass} />
							</div>
							<div className="min-w-0">
								<p className="text-2xl font-bold text-foreground">
									{getOptionCount(stat.kind)}
								</p>
								<p className="mt-0.5 text-xs text-muted">{meta.title}</p>
							</div>
						</Card.Content>
					</Card>
				);
			})}
		</div>
	);
}

function OptionIdentity({ option }: { option: CatalogOption }) {
	return (
		<div className="flex min-w-0 items-center gap-3">
			<OptionAvatar option={option} />
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{option.name}
				</p>
				<p className="mt-0.5 truncate text-xs text-muted">{option.id}</p>
			</div>
		</div>
	);
}

function OptionAvatar({ option }: { option: CatalogOption }) {
	if (option.kind === "colors") {
		return (
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
				<span
					className="size-5 rounded-full border border-border"
					style={{ backgroundColor: option.hexCode ?? "transparent" }}
				/>
			</div>
		);
	}

	const Icon = OPTION_META[option.kind].Icon;

	return (
		<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted">
			<Icon size={16} />
		</div>
	);
}

function OptionsToolbar({
	kind,
	onAdd,
	onPreview,
}: {
	kind: OptionKind;
	onAdd: () => void;
	onPreview: (message: string) => void;
}) {
	return (
		<Card className="p-3">
			<Card.Content className="flex flex-col gap-3 p-0 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">
					<form
						className="min-w-0 flex-1"
						onSubmit={(event) => {
							event.preventDefault();
							onPreview(`${OPTION_META[kind].title} search preview submitted`);
						}}
					>
						<TextField className="min-w-0 flex-1" name="search">
							<InputGroup fullWidth variant="primary">
								<InputGroup.Prefix>
									<Search size={14} className="text-muted" />
								</InputGroup.Prefix>
								<InputGroup.Input
									aria-label={`Search ${OPTION_META[kind].title}`}
									placeholder={`Search ${OPTION_META[kind].title.toLowerCase()}`}
								/>
							</InputGroup>
						</TextField>
					</form>

					<Select
						className="w-full md:w-36"
						defaultSelectedKey="name"
						placeholder="Search by"
					>
						<Select.Trigger>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								{SEARCH_TYPES.map((option) => (
									<ListBox.Item
										key={option.id}
										id={option.id}
										textValue={option.label}
									>
										{option.label}
										<ListBox.ItemIndicator />
									</ListBox.Item>
								))}
							</ListBox>
						</Select.Popover>
					</Select>
				</div>

				<Button size="sm" variant="primary" onPress={onAdd}>
					<Plus size={16} />
					{OPTION_META[kind].addLabel}
				</Button>
			</Card.Content>
		</Card>
	);
}

function OptionsTable({
	kind,
	onDelete,
	onEdit,
}: {
	kind: OptionKind;
	onDelete: (option: CatalogOption) => void;
	onEdit: (option: CatalogOption) => void;
}) {
	const options = OPTIONS_BY_KIND[kind];

	return (
		<Card className="overflow-hidden">
			<Card.Content className="p-0">
				<Table>
					<Table.ScrollContainer>
						<Table.Content
							aria-label={OPTION_META[kind].title}
							className="min-w-[860px]"
						>
							<Table.Header>
								<Table.Column isRowHeader className="w-[280px]">
									Name
								</Table.Column>
								<Table.Column>{OPTION_META[kind].valueLabel}</Table.Column>
								<Table.Column>Variants</Table.Column>
								<Table.Column>Created</Table.Column>
								<Table.Column>Updated</Table.Column>
								<Table.Column className="w-12">Actions</Table.Column>
							</Table.Header>
							<Table.Body>
								{options.map((option) => (
									<Table.Row key={option.id}>
										<Table.Cell>
											<OptionIdentity option={option} />
										</Table.Cell>
										<Table.Cell>
											<ValueCell option={option} />
										</Table.Cell>
										<Table.Cell>
											<Chip size="sm" variant="soft">
												{option.usageCount} variants
											</Chip>
										</Table.Cell>
										<Table.Cell>
											<span className="text-sm text-muted">
												{formatDate(option.createdAt)}
											</span>
										</Table.Cell>
										<Table.Cell>
											<span className="text-sm text-muted">
												{formatDate(option.updatedAt)}
											</span>
										</Table.Cell>
										<Table.Cell>
											<OptionActions
												onDelete={onDelete}
												onEdit={onEdit}
												option={option}
											/>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Content>
					</Table.ScrollContainer>
				</Table>
			</Card.Content>
		</Card>
	);
}

function ValueCell({ option }: { option: CatalogOption }) {
	if (option.kind === "colors") {
		return (
			<div className="flex items-center gap-2">
				<span
					className="size-3 rounded-full border border-border"
					style={{ backgroundColor: option.hexCode ?? "transparent" }}
				/>
				<code className="rounded bg-secondary px-1.5 py-1 text-xs text-muted">
					{getOptionValue(option)}
				</code>
			</div>
		);
	}

	return (
		<span className="text-sm text-foreground">{getOptionValue(option)}</span>
	);
}

function OptionActions({
	onDelete,
	onEdit,
	option,
}: {
	onDelete: (option: CatalogOption) => void;
	onEdit: (option: CatalogOption) => void;
	option: CatalogOption;
}) {
	return (
		<Dropdown>
			<Button aria-label="Option actions" isIconOnly size="sm" variant="ghost">
				<MoreHorizontal size={16} />
			</Button>
			<Dropdown.Popover className="min-w-36">
				<div className="flex flex-col gap-1 p-1">
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onEdit(option)}
					>
						Edit
					</Button>
					<Button
						className="justify-start text-danger"
						size="sm"
						variant="ghost"
						onPress={() => onDelete(option)}
					>
						Delete
					</Button>
				</div>
			</Dropdown.Popover>
		</Dropdown>
	);
}

function OptionsTabPanel({
	kind,
	onAdd,
	onDelete,
	onEdit,
	onPreview,
}: {
	kind: OptionKind;
	onAdd: () => void;
	onDelete: (option: CatalogOption) => void;
	onEdit: (option: CatalogOption) => void;
	onPreview: (message: string) => void;
}) {
	const meta = OPTION_META[kind];

	return (
		<Tabs.Panel id={kind} className="mt-4">
			<div className="flex flex-col gap-3">
				<Card className="border-border/80 p-4">
					<Card.Content className="flex flex-col gap-3 p-0 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex min-w-0 items-center gap-3">
							<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted">
								<meta.Icon size={17} />
							</div>
							<div className="min-w-0">
								<p className="text-sm font-medium text-foreground">
									{meta.title}
								</p>
								<p className="mt-0.5 text-sm text-muted">{meta.description}</p>
							</div>
						</div>
						<Chip size="sm" variant="soft">
							{OPTIONS_BY_KIND[kind].length} options
						</Chip>
					</Card.Content>
				</Card>
				<OptionsToolbar kind={kind} onAdd={onAdd} onPreview={onPreview} />
				<OptionsTable kind={kind} onDelete={onDelete} onEdit={onEdit} />
			</div>
		</Tabs.Panel>
	);
}

function OptionFormModal({
	modal,
	onClose,
}: {
	modal: OptionModalState | null;
	onClose: () => void;
}) {
	const kind = modal?.kind ?? "colors";
	const option = modal?.option;
	const isEditing = modal?.mode === "edit";
	const meta = OPTION_META[kind];

	return (
		<Modal
			isOpen={modal !== null}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-[520px]">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Icon className="bg-accent/10 text-accent">
								<meta.Icon size={20} />
							</Modal.Icon>
							<Modal.Heading>
								{isEditing ? `Edit ${meta.title}` : meta.addLabel}
							</Modal.Heading>
						</Modal.Header>

						<Modal.Body className="flex flex-col gap-4">
							<TextField className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">
									Name <span className="text-danger">*</span>
								</Label>
								<InputGroup variant="primary">
									<InputGroup.Input
										defaultValue={option?.name ?? ""}
										placeholder={kind === "colors" ? "Space Black" : "256 GB"}
									/>
								</InputGroup>
							</TextField>

							{kind === "colors" ? (
								<TextField className="flex flex-col gap-1.5">
									<Label className="text-sm font-medium">Hex code</Label>
									<InputGroup variant="primary">
										<InputGroup.Input
											defaultValue={
												option?.kind === "colors" ? (option.hexCode ?? "") : ""
											}
											placeholder="#1F2024"
										/>
									</InputGroup>
								</TextField>
							) : (
								<NumberField
									className="flex flex-col gap-1.5"
									defaultValue={getDefaultNumberValue(option, kind)}
									minValue={0}
									step={kind === "screens" ? 0.1 : 1}
									variant="primary"
								>
									<Label className="text-sm font-medium">
										{meta.valueLabel} <span className="text-danger">*</span>
									</Label>
									<NumberField.Group>
										<NumberField.Input className="w-full min-w-0" />
									</NumberField.Group>
								</NumberField>
							)}
						</Modal.Body>

						<Modal.Footer className="flex justify-end gap-2">
							<Button variant="ghost" onPress={onClose}>
								Cancel
							</Button>
							<Button variant="primary" onPress={onClose}>
								{isEditing ? "Save Preview" : "Create Preview"}
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

function getDefaultNumberValue(
	option: CatalogOption | null | undefined,
	kind: OptionKind,
) {
	if (!option) return kind === "screens" ? 6.1 : 1;
	if (option.kind === "storage" || option.kind === "ram") return option.valueGb;
	if (option.kind === "screens") return option.valueInches;

	return 1;
}

function OptionDeleteModal({
	onClose,
	option,
}: {
	onClose: () => void;
	option: CatalogOption | null;
}) {
	return (
		<Modal
			isOpen={option !== null}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-[420px]">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Icon className="bg-danger/10 text-danger">
								<Trash2 size={20} />
							</Modal.Icon>
							<Modal.Heading>Delete Option</Modal.Heading>
						</Modal.Header>

						<Modal.Body>
							<p className="text-sm text-muted">
								Are you sure you want to delete{" "}
								<span className="font-medium text-foreground">
									{option?.name ?? "this option"}
								</span>
								?
							</p>
						</Modal.Body>

						<Modal.Footer className="flex justify-end gap-2">
							<Button variant="ghost" onPress={onClose}>
								Cancel
							</Button>
							<Button variant="danger" onPress={onClose}>
								Delete Preview
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

export function InventoryPage() {
	const [previewMessage, setPreviewMessage] = useState(
		"Options page uses local mock data",
	);
	const [modal, setModal] = useState<OptionModalState | null>(null);
	const [deleteOption, setDeleteOption] = useState<CatalogOption | null>(null);

	return (
		<div className="flex flex-col gap-6">

			<OptionStats />

			<Card className="border-accent/20 bg-accent/5 px-4 py-3">
				<Card.Content className="flex flex-col gap-2 p-0 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-start gap-3">
						<Database size={18} className="mt-0.5 shrink-0 text-accent" />
						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground">
								{previewMessage}
							</p>
							<p className="mt-1 text-xs text-muted">
								Controls are UI-only and do not call backend actions.
							</p>
						</div>
					</div>
					<Button
						className="shrink-0"
						size="sm"
						variant="secondary"
						onPress={() =>
							setPreviewMessage("Options page uses local mock data")
						}
					>
						Reset message
					</Button>
				</Card.Content>
			</Card>

			<Tabs defaultSelectedKey="colors">
				<Tabs.List className="flex flex-wrap gap-1">
					<Tabs.Tab id="colors">
						<Palette size={14} />
						Colors
						<Tabs.Indicator />
					</Tabs.Tab>
					<Tabs.Tab id="storage">
						<HardDrive size={14} />
						Storage
						<Tabs.Indicator />
					</Tabs.Tab>
					<Tabs.Tab id="ram">
						<MemoryStick size={14} />
						RAM
						<Tabs.Indicator />
					</Tabs.Tab>
					<Tabs.Tab id="screens">
						<Monitor size={14} />
						Screen Sizes
						<Tabs.Indicator />
					</Tabs.Tab>
				</Tabs.List>

				{(["colors", "storage", "ram", "screens"] as OptionKind[]).map(
					(kind) => (
						<OptionsTabPanel
							key={kind}
							kind={kind}
							onAdd={() => setModal({ kind, mode: "create", option: null })}
							onDelete={setDeleteOption}
							onEdit={(option) => setModal({ kind, mode: "edit", option })}
							onPreview={setPreviewMessage}
						/>
					),
				)}
			</Tabs>

			<OptionFormModal modal={modal} onClose={() => setModal(null)} />
			<OptionDeleteModal
				option={deleteOption}
				onClose={() => setDeleteOption(null)}
			/>
		</div>
	);
}
