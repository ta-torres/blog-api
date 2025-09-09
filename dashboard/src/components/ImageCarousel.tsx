import { useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Copy, Trash2, CheckCircle } from "lucide-react";

interface ImageData {
  public_id: string;
  secure_url: string;
  original_filename: string;
}

interface ImageCarouselProps {
  images: ImageData[];
  onDeleteImage: (publicId: string) => Promise<void>;
}

const ImageCarousel = ({ images, onDeleteImage }: ImageCarouselProps) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  const cloud = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
  });

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleDelete = async (publicId: string) => {
    setDeletingImage(publicId);
    try {
      await onDeleteImage(publicId);
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setDeletingImage(null);
    }
  };

  if (images.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Carousel className="w-full max-w-4xl">
        <CarouselContent>
          {images.map((image) => {
            const imageThumbnail = cloud
              .image(image.public_id)
              .resize(thumbnail().width(300).height(200));

            return (
              <CarouselItem
                key={image.public_id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Card className="py-0">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                        <AdvancedImage
                          cldImg={imageThumbnail}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="truncate text-sm font-medium text-gray-900">
                          {image.original_filename}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {image.public_id}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(image.secure_url)}
                          className="flex-1"
                        >
                          {copiedUrl === image.secure_url ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1 h-3 w-3" />
                              Copy URL
                            </>
                          )}
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(image.public_id)}
                          disabled={deletingImage === image.public_id}
                        >
                          {deletingImage === image.public_id ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white"></div>
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
