import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Star, Plus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import heic2any from "heic2any";

// دالة للتحقق من صيغة HEIC
const isHeicFile = (file: File): boolean => {
  const heicTypes = ['image/heic', 'image/heif'];
  return heicTypes.includes(file.type.toLowerCase()) || 
         /\.(heic|heif)$/i.test(file.name);
};

// دالة لتحويل HEIC إلى JPG
const convertHeicToJpg = async (file: File): Promise<File> => {
  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9
    });
    
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
    return new File([blob], newFileName, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error converting HEIC:', error);
    throw new Error('فشل تحويل صورة HEIC');
  }
};

interface TrailerImage {
  id: number;
  trailerId: number;
  imageUrl: string;
  isPrimary: boolean | null;
  sortOrder: number | null;
}

interface TrailerMultiImageUploadProps {
  trailerId?: number;
  images: TrailerImage[];
  onImagesChange: (images: TrailerImage[]) => void;
  pendingImages?: string[];
  onPendingImagesChange?: (urls: string[] | ((prev: string[]) => string[])) => void;
}

export function TrailerMultiImageUpload({ 
  trailerId, 
  images, 
  onImagesChange,
  pendingImages = [],
  onPendingImagesChange
}: TrailerMultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImageMutation = trpc.trailerImages.add.useMutation({
    onSuccess: (newImage) => {
      if (newImage) {
        onImagesChange([...images, newImage]);
        toast.success("تم إضافة الصورة بنجاح");
      }
    },
    onError: (error) => {
      toast.error("حدث خطأ: " + error.message);
    },
  });

  const deleteImageMutation = trpc.trailerImages.delete.useMutation({
    onSuccess: (_, variables) => {
      onImagesChange(images.filter((img) => img.id !== variables.id));
      toast.success("تم حذف الصورة");
    },
    onError: (error) => {
      toast.error("حدث خطأ: " + error.message);
    },
  });

  const setPrimaryMutation = trpc.trailerImages.setPrimary.useMutation({
    onSuccess: (_, variables) => {
      onImagesChange(
        images.map((img) => ({
          ...img,
          isPrimary: img.id === variables.imageId,
        }))
      );
      toast.success("تم تعيين الصورة الرئيسية");
    },
    onError: (error) => {
      toast.error("حدث خطأ: " + error.message);
    },
  });

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // قبول صيغ الصور المختلفة بما فيها HEIC من iPhone
    const validImageTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'image/heic', 'image/heif', 'image/bmp', 'image/tiff'
    ];
    const isValidImage = file.type.startsWith("image/") || 
                         validImageTypes.includes(file.type.toLowerCase()) ||
                         /\.(jpg|jpeg|png|gif|webp|heic|heif|bmp|tiff)$/i.test(file.name);
    
    if (!isValidImage) {
      toast.error("يرجى اختيار ملف صورة فقط (JPG, PNG, WEBP, HEIC)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 10 ميجابايت");
      return;
    }

    setIsUploading(true);

    try {
      let fileToUpload = file;
      
      // تحويل HEIC إلى JPG إذا لزم الأمر
      if (isHeicFile(file)) {
        toast.info("جاري تحويل صورة HEIC...");
        fileToUpload = await convertHeicToJpg(file);
        toast.success("تم تحويل الصورة بنجاح");
      }
      
      const formData = new FormData();
      formData.append("image", fileToUpload);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("فشل رفع الصورة");
      }

      const data = await response.json();
      
      if (trailerId) {
        addImageMutation.mutate({
          trailerId,
          imageUrl: data.url,
          isPrimary: images.length === 0,
          sortOrder: images.length,
        });
      } else {
        if (onPendingImagesChange) {
          // استخدام callback للحصول على القيمة الحالية وتجنب استبدال الصور
          onPendingImagesChange((prev: string[]) => [...prev, data.url]);
        }
        toast.success("تم رفع الصورة بنجاح");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleFiles = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      await handleFileUpload(files[i]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultipleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleMultipleFiles(e.target.files);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;

    if (trailerId) {
      addImageMutation.mutate({
        trailerId,
        imageUrl: urlInput.trim(),
        isPrimary: images.length === 0,
        sortOrder: images.length,
      });
    } else {
      if (onPendingImagesChange) {
        onPendingImagesChange((prev: string[]) => [...prev, urlInput.trim()]);
      }
    }
    setUrlInput("");
  };

  const handleDeleteImage = (imageId: number) => {
    if (trailerId) {
      deleteImageMutation.mutate({ id: imageId });
    }
  };

  const handleDeletePendingImage = (index: number) => {
    if (onPendingImagesChange) {
      onPendingImagesChange(pendingImages.filter((_, i) => i !== index));
    }
  };

  const handleSetPrimary = (imageId: number) => {
    if (trailerId) {
      setPrimaryMutation.mutate({ trailerId, imageId });
    }
  };

  const allImages = [
    ...images.map((img) => ({ ...img, isPending: false })),
    ...pendingImages.map((url, index) => ({
      id: -(index + 1),
      trailerId: 0,
      imageUrl: url,
      isPrimary: index === 0 && images.length === 0,
      sortOrder: images.length + index,
      isPending: true,
    })),
  ];

  return (
    <div className="space-y-4">
      <Label>معرض صور المقطورة</Label>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="trailer-multi-image-upload"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">جاري رفع الصور...</p>
          </div>
        ) : (
          <label
            htmlFor="trailer-multi-image-upload"
            className="flex flex-col items-center justify-center py-4 cursor-pointer"
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground mb-1">
              اسحب الصور هنا أو انقر للاختيار
            </p>
            <p className="text-xs text-muted-foreground">
              يمكنك رفع عدة صور دفعة واحدة (PNG, JPG, WEBP حتى 10 ميجابايت لكل صورة)
            </p>
          </label>
        )}
      </div>

      {/* URL Input */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="أو أدخل رابط الصورة مباشرة"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddUrl}
          disabled={!urlInput.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Images Grid */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative group rounded-lg overflow-hidden border-2 ${
                image.isPrimary ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={image.imageUrl}
                alt={`صورة ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x300?text=Error";
                }}
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isPending && trailerId && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleSetPrimary(image.id)}
                    title="تعيين كصورة رئيسية"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        image.isPrimary ? "fill-yellow-400 text-yellow-400" : ""
                      }`}
                    />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    image.isPending
                      ? handleDeletePendingImage(Math.abs(image.id) - 1)
                      : handleDeleteImage(image.id)
                  }
                  title="حذف الصورة"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Primary badge */}
              {image.isPrimary && (
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  رئيسية
                </div>
              )}

              {/* Pending badge */}
              {image.isPending && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  في الانتظار
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {allImages.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          لم يتم إضافة أي صور بعد
        </p>
      )}
    </div>
  );
}
