"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Upload, Image, X, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  value: string;
  onChange: (value: string) => void;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  onError?: (error: string) => void;
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-20 w-20",
  lg: "h-24 w-24",
  xl: "h-32 w-32",
};

const sizePreviewClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-28 w-28",
  xl: "h-36 w-36",
};

export function AvatarUpload({
  value,
  onChange,
  alt = "Avatar",
  size = "md",
  className,
  label = "Profile Photo",
  accept = "image/*",
  maxSizeMB = 5,
  onError,
}: AvatarUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const inputId = React.useId();

  const currentImage = preview || value;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const err = "Please select an image file";
      setError(err);
      onError?.(err);
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      const err = `File size must be less than ${maxSizeMB}MB`;
      setError(err);
      onError?.(err);
      return;
    }

    setError(null);
    setIsUploading(true);

    // Prefer a Supabase Storage URL so the profile image remains small and durable.
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });
        if (!uploadError) {
          const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
          if (data.publicUrl) {
            setPreview(data.publicUrl);
            onChange(data.publicUrl);
            setIsUploading(false);
            return;
          }
        }
      }
    } catch (storageError) {
      console.warn("Avatar storage upload unavailable; using profile fallback:", storageError);
    }

    // Fallback keeps the selected image available for the profile save callback.
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
      setIsUploading(false);
    };
    reader.onerror = () => {
      const err = "Failed to read file";
      setError(err);
      onError?.(err);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative">
        <div className={cn(
          "relative rounded-2xl overflow-hidden border-4 border-white/30 shadow-lg bg-muted/50",
          sizeClasses[size]
        )}>
          {currentImage ? (
            <img
              src={currentImage}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/50">
              <Image className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Remove button */}
        {(currentImage || preview) && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-lg hover:bg-destructive/90 transition-colors"
            aria-label="Remove avatar"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Upload button overlay */}
        <button
          type="button"
          onClick={triggerFileInput}
          className={cn(
            "absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors",
            size === "sm" && "bottom-1 right-1 p-1.5",
            size === "xl" && "bottom-2 right-2 p-3"
          )}
          aria-label="Upload avatar"
          disabled={isUploading}
        >
          <Upload className={cn("h-4 w-4", size === "sm" && "h-3.5 w-3.5", size === "xl" && "h-5 w-5")} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id={`avatar-upload-${inputId}`}
        disabled={isUploading}
      />

      <label
        htmlFor={`avatar-upload-${inputId}`}
        className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
      >
        {label}
      </label>

      {error && (
        <p className="text-xs text-destructive text-center max-w-xs" role="alert">
          {error}
        </p>
      )}

      {currentImage && !preview && (
        <p className="text-xs text-muted-foreground text-center">
          Current image from URL
        </p>
      )}
    </div>
  );
}