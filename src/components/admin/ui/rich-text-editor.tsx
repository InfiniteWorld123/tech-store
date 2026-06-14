"use client";

import { Button } from "@heroui/react";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Heading1,
	Heading2,
	Italic,
	LinkIcon,
	List,
	ListOrdered,
	Redo2,
	Undo2,
	Unlink,
} from "lucide-react";
import { type ReactNode, useEffect } from "react";

type RichTextEditorProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	errorText?: string;
};

export function RichTextEditor({
	label,
	value,
	onChange,
	placeholder,
	errorText,
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: "https",
			}),
			Placeholder.configure({
				placeholder,
			}),
		],
		content: value,
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class:
					"min-h-36 px-3 py-2.5 text-sm text-foreground outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_a]:text-accent [&_a]:underline",
			},
		},
		onUpdate: ({ editor: currentEditor }) => {
			onChange(currentEditor.getHTML());
		},
	});

	useEffect(() => {
		if (!editor || editor.getHTML() === value) return;
		editor.commands.setContent(value, { emitUpdate: false });
	}, [editor, value]);

	function setLink() {
		if (!editor) return;
		const previousUrl = editor.getAttributes("link").href as string | undefined;
		const url = window.prompt("Link URL", previousUrl ?? "");

		if (url === null) return;
		if (url.trim() === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	}

	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-sm font-medium text-foreground">{label}</span>
			<div
				className={[
					"overflow-hidden rounded-xl border bg-surface transition-all focus-within:ring-2 focus-within:ring-accent/40",
					errorText ? "border-danger" : "border-border",
				]
					.filter(Boolean)
					.join(" ")}
			>
				<div className="flex flex-wrap gap-1 border-b border-border bg-default/30 p-2">
					<ToolbarButton
						label="Heading 1"
						isActive={editor?.isActive("heading", { level: 1 })}
						onPress={() =>
							editor?.chain().focus().toggleHeading({ level: 1 }).run()
						}
					>
						<Heading1 size={15} />
					</ToolbarButton>
					<ToolbarButton
						label="Heading 2"
						isActive={editor?.isActive("heading", { level: 2 })}
						onPress={() =>
							editor?.chain().focus().toggleHeading({ level: 2 }).run()
						}
					>
						<Heading2 size={15} />
					</ToolbarButton>
					<ToolbarButton
						label="Bold"
						isActive={editor?.isActive("bold")}
						onPress={() => editor?.chain().focus().toggleBold().run()}
					>
						<Bold size={15} />
					</ToolbarButton>
					<ToolbarButton
						label="Italic"
						isActive={editor?.isActive("italic")}
						onPress={() => editor?.chain().focus().toggleItalic().run()}
					>
						<Italic size={15} />
					</ToolbarButton>
					<ToolbarButton
						label="Bulleted list"
						isActive={editor?.isActive("bulletList")}
						onPress={() => editor?.chain().focus().toggleBulletList().run()}
					>
						<List size={15} />
					</ToolbarButton>
					<ToolbarButton
						label="Numbered list"
						isActive={editor?.isActive("orderedList")}
						onPress={() => editor?.chain().focus().toggleOrderedList().run()}
					>
						<ListOrdered size={15} />
					</ToolbarButton>
					<ToolbarButton
						label="Link"
						isActive={editor?.isActive("link")}
						onPress={setLink}
					>
						<LinkIcon size={15} />
					</ToolbarButton>
					<ToolbarButton
						label="Remove link"
						onPress={() =>
							editor?.chain().focus().extendMarkRange("link").unsetLink().run()
						}
					>
						<Unlink size={15} />
					</ToolbarButton>
					<ToolbarButton
						label="Undo"
						onPress={() => editor?.chain().focus().undo().run()}
					>
						<Undo2 size={15} />
					</ToolbarButton>
					<ToolbarButton
						label="Redo"
						onPress={() => editor?.chain().focus().redo().run()}
					>
						<Redo2 size={15} />
					</ToolbarButton>
				</div>
				<EditorContent editor={editor} className="tiptap-editor" />
			</div>
			{errorText ? (
				<span className="text-xs text-danger">{errorText}</span>
			) : null}
		</div>
	);
}

function ToolbarButton({
	label,
	isActive,
	onPress,
	children,
}: {
	label: string;
	isActive?: boolean;
	onPress: () => void;
	children: ReactNode;
}) {
	return (
		<Button
			type="button"
			isIconOnly
			size="sm"
			variant={isActive ? "primary" : "ghost"}
			onPress={onPress}
			aria-label={label}
			title={label}
			className="size-8"
		>
			{children}
		</Button>
	);
}
