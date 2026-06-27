import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import heic2any from "heic2any";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

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
    
    // heic2any قد يُرجع مصفوفة أو blob واحد
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    
    // إنشاء ملف جديد بصيغة JPG
    const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
    return new File([blob], newFileName, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error converting HEIC:', error);
    throw new Error('فشل تحويل صورة HEIC');
  }
};

export function ImageUpload({ value, onChange, label = "صورة الشاحنة" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 10 ميجابايت");
      return;
    }

    setIsUploading(true);

    try {
      let fileToUpload = file;
      
      // تحويل HEIC إلى JPG إذا لزم الأمر
      if (isHeicFile(file)) {
        setIsConverting(true);
        toast.info("جاري تحويل صورة HEIC...");
        fileToUpload = await convertHeicToJpg(file);
        setIsConverting(false);
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
      onChange(data.url);
      toast.success("تم رفع الصورة بنجاح");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploading(false);
      setIsConverting(false);
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
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
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">
              {isConverting ? "جاري تحويل صورة HEIC..." : "جاري رفع الصورة..."}
            </p>
          </div>
        ) : value ? (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Error";
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center py-4 cursor-pointer"
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground mb-1">
              اسحب الصورة هنا أو انقر للاختيار
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP, HEIC حتى 10 ميجابايت
            </p>
          </label>
        )}
      </div>

      {/* URL Input as alternative */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            placeholder="أو أدخل رابط الصورة مباشرة"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        {!value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
