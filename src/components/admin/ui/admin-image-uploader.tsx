import { Button, toast } from "@heroui/react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { useUploadThing } from "#/lib/uploadthing";

type AdminImageUploaderProps = {
	value?: string;
	label?: string;
	helperText?: string;
	onUploaded: (url: string) => void;
};

export function AdminImageUploader({
	value,
	label = "Image upload",
	helperText = "Choose an image or drag it here.",
	onUploaded,
}: AdminImageUploaderProps) {
	const inputId = useId();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedPreview, setSelectedPreview] = useState<string>("");
	const [uploadProgress, setUploadProgress] = useState(0);

	const { startUpload, isUploading } = useUploadThing("imageUploader", {
		onUploadProgress: ({ progress }) => {
			setUploadProgress(progress);
		},
		onClientUploadComplete: (files) => {
			const imageUrl = files[0]?.ufsUrl;
			if (imageUrl) {
				onUploaded(imageUrl);
				setSelectedFile(null);
				setSelectedPreview("");
				setUploadProgress(100);
				toast.success("Image uploaded successfully");
			}
		},
		onUploadError: (error) => {
			toast.danger(error.message || "Image upload failed");
			setUploadProgress(0);
		},
	});

	useEffect(() => {
		if (!selectedFile) {
			setSelectedPreview("");
			return;
		}

		const nextPreview = URL.createObjectURL(selectedFile);
		setSelectedPreview(nextPreview);

		return () => URL.revokeObjectURL(nextPreview);
	}, [selectedFile]);

	const previewUrl = selectedPreview || value || "";
	const uploadLabel = useMemo(() => {
		if (isUploading) return `Uploading ${uploadProgress}%`;
		if (selectedFile) return selectedFile.name;
		return "Choose image";
	}, [isUploading, selectedFile, uploadProgress]);

	const handleFile = (file: File | undefined) => {
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.danger("Please choose an image file");
			return;
		}

		setUploadProgress(0);
		setSelectedFile(file);
	};

	const uploadSelectedFile = async () => {
		if (!selectedFile) {
			toast.danger("Choose an image before uploading");
			return;
		}

		setUploadProgress(1);
		await startUpload([selectedFile]);
	};

	return (
		<div className="space-y-3">
			<p className="text-sm font-medium text-foreground">{label}</p>
			<label
				htmlFor={inputId}
				onDragOver={(event) => event.preventDefault()}
				onDrop={(event) => {
					event.preventDefault();
					handleFile(event.dataTransfer.files[0]);
				}}
				className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-default/30 p-4 text-center transition hover:border-primary hover:bg-primary/5"
			>
				{previewUrl ? (
					<img
						src={previewUrl}
						alt="Selected upload preview"
						className="h-36 w-full rounded-xl border border-border object-cover"
					/>
				) : (
					<div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
						<ImageIcon className="size-6" />
					</div>
				)}
				<div className="space-y-1">
					<p className="text-sm font-semibold text-foreground">{uploadLabel}</p>
					<p className="text-xs text-muted">{helperText}</p>
				</div>
				<input
					id={inputId}
					type="file"
					accept="image/*"
					className="sr-only"
					onChange={(event) => handleFile(event.target.files?.[0])}
				/>
			</label>

			{isUploading ? (
				<div
					className="h-2 overflow-hidden rounded-full bg-default"
					role="progressbar"
					aria-label="Image upload progress"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={uploadProgress}
				>
					<div
						className="h-full rounded-full bg-primary transition-all"
						style={{ width: `${uploadProgress}%` }}
					/>
				</div>
			) : null}

			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					size="sm"
					color="primary"
					startContent={
						isUploading ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Upload className="size-4" />
						)
					}
					isDisabled={!selectedFile || isUploading}
					onPress={uploadSelectedFile}
				>
					{isUploading ? "Uploading" : "Upload image"}
				</Button>
				{selectedFile ? (
					<Button
						type="button"
						size="sm"
						variant="flat"
						startContent={<X className="size-4" />}
						isDisabled={isUploading}
						onPress={() => {
							setSelectedFile(null);
							setUploadProgress(0);
						}}
					>
						Clear
					</Button>
				) : null}
			</div>
		</div>
	);
}
