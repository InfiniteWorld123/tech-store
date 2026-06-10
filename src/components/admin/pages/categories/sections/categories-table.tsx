import { Button, Chip } from "@heroui/react";
import { Pencil, Tags, Trash2 } from "lucide-react";
import { CategoryIconDisplay } from "#/components/ui/icons/category-icon";
import type { CategoryWithCount } from "#/server/catalog/categories/categories.types";

type Props = {
	categories: CategoryWithCount[];
	onEdit: (category: CategoryWithCount) => void;
	onDelete: (category: CategoryWithCount) => void;
};

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
	return (
		<div className="py-16 flex flex-col items-center gap-3 text-center">
			<Tags size={28} className="text-muted" />
			<div>
				<p className="text-sm font-medium text-foreground">
					{hasSearch ? "No categories match your search" : "No categories yet"}
				</p>
				<p className="text-xs text-muted mt-1">
					{hasSearch
						? "Try a different search term."
						: "Create your first category to get started."}
				</p>
			</div>
		</div>
	);
}

export function CategoriesTable({ categories, onEdit, onDelete }: Props) {
	if (categories.length === 0) {
		return <EmptyState hasSearch={false} />;
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-border">
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Category
						</th>
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Slug
						</th>
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Products
						</th>
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Created
						</th>
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Updated
						</th>
						<th className="text-right py-3 px-2 text-xs font-semibold text-muted">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{categories.map((cat) => (
						<tr
							key={cat.id}
							className="border-b border-border last:border-0 hover:bg-default/50 transition-colors"
						>
							{/* Category */}
							<td className="py-3 px-2">
								<div className="flex items-center gap-3">
									<CategoryIconDisplay
										icon={cat.icon}
										iconColor={cat.iconColor}
										iconBg={cat.iconBg}
										name={cat.name}
									/>
									<span className="font-medium text-foreground whitespace-nowrap">
										{cat.name}
									</span>
								</div>
							</td>

							{/* Slug */}
							<td className="py-3 px-2">
								<code className="text-xs bg-default px-2 py-0.5 rounded-md text-muted border border-border">
									{cat.slug}
								</code>
							</td>

							{/* Products */}
							<td className="py-3 px-2">
								<Chip size="sm" variant="soft" color="default">
									{cat.totalProducts}
								</Chip>
							</td>

							{/* Created */}
							<td className="py-3 px-2 text-muted whitespace-nowrap">
								{new Date(cat.createdAt).toLocaleDateString()}
							</td>

							{/* Updated */}
							<td className="py-3 px-2 text-muted whitespace-nowrap">
								{new Date(cat.updatedAt).toLocaleDateString()}
							</td>

							{/* Actions */}
							<td className="py-3 px-2">
								<div className="flex items-center justify-end gap-1">
									<Button
										isIconOnly
										size="sm"
										variant="ghost"
										onPress={() => onEdit(cat)}
										aria-label={`Edit ${cat.name}`}
										className="text-muted hover:text-foreground"
									>
										<Pencil size={15} />
									</Button>
									<Button
										isIconOnly
										size="sm"
										variant="ghost"
										onPress={() => onDelete(cat)}
										aria-label={`Delete ${cat.name}`}
										className="text-muted hover:text-danger"
									>
										<Trash2 size={15} />
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
