import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface TruckImage {
  id: number;
  truckId: number;
  imageUrl: string;
  isPrimary: boolean | null;
  sortOrder: number | null;
}

export interface ImageGalleryProps {
  images: TruckImage[] | string[];
  primaryImage?: string | null;
  truckName?: string;
  alt?: string;
}

export function ImageGallery({ images, primaryImage, truckName, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Normalize images to TruckImage format
  const normalizedImages: TruckImage[] = images.map((img, index) => {
    if (typeof img === 'string') {
      return { id: index, truckId: 0, imageUrl: img, isPrimary: index === 0, sortOrder: index };
    }
    return img;
  });

  // Combine primary image with gallery images
  const allImages = [
    ...(primaryImage ? [{ id: 0, truckId: 0, imageUrl: primaryImage, isPrimary: true, sortOrder: -1 }] : []),
    ...normalizedImages.filter(img => img.imageUrl !== primaryImage),
  ];

  const displayName = truckName || alt || 'Image';

  if (allImages.length === 0) {
    return null;
  }

  const currentImage = allImages[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={currentImage.imageUrl}
            alt={`${displayName} - صورة ${selectedIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
            onClick={() => openLightbox(selectedIndex)}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/800x600?text=No+Image";
            }}
          />
        </div>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
          onClick={() => openLightbox(selectedIndex)}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-primary/50"
              }`}
            >
              <img
                src={image.imageUrl}
                alt={`${truckName} - صورة مصغرة ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Error";
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <VisuallyHidden.Root>
            <DialogTitle>معرض صور {truckName}</DialogTitle>
          </VisuallyHidden.Root>
          
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Main Image */}
            <img
              src={allImages[selectedIndex].imageUrl}
              alt={`${displayName} - صورة ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/800x600?text=Error";
              }}
            />

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
              {selectedIndex + 1} / {allImages.length}
            </div>
          </div>

          {/* Thumbnails in Lightbox */}
          {allImages.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-2 rounded-lg max-w-[90vw] overflow-x-auto">
              {allImages.map((image, index) => (
                <button
                  key={image.id || index}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                    index === selectedIndex
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={`صورة مصغرة ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
