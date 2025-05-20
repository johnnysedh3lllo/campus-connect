import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUserAvatar } from "@/hooks/tanstack/mutations/use-update-user-avatar";
import { toast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/store/user-store";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";

// TODO: SIMPLIFY THIS COMPONENT
export function ProfilePictureUploadModal({
  initialAvatarUrl,
  croppedImage,
  isCropOpen,
  setIsCropOpen,
  setIsUploading,
  setCroppedImage,
  selectedImage,
  setSelectedImage,
}: {
  initialAvatarUrl: UserPublic["avatar_url"] | undefined;
  croppedImage: string | null;
  isCropOpen: boolean;
  setIsCropOpen: Dispatch<SetStateAction<boolean>>;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  setCroppedImage: Dispatch<SetStateAction<string | null>>;
  selectedImage: string | null;
  setSelectedImage: Dispatch<SetStateAction<string | null>>;
}) {
  const { userId } = useUserStore();

  const [originalImage, setOriginalImage] = useState<string | null>(
    initialAvatarUrl || null,
  );
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  const userAvatarMutation = useUpdateUserAvatar();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = e.currentTarget;

    const { width, height } = e.currentTarget;
    const cropSize = Math.min(width, height);
    const x = (width - cropSize) / 2;
    const y = (height - cropSize) / 2;

    setCrop({
      unit: "px",
      width: cropSize,
      height: cropSize,
      x,
      y,
    });
  };

  const getCroppedImg = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = crop.width! * scaleX;
    canvas.height = crop.height! * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imageRef.current,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width! * scaleX,
      crop.height! * scaleY,
    );

    const base64Image = canvas.toDataURL("image/jpeg");

    setOriginalImage(croppedImage);
    setIsCropOpen(false);
    setIsUploading(true);

    try {
      const result = await userAvatarMutation.mutateAsync({
        base64Image,
        userId: userId ?? undefined,
      });

      if (result?.success) {
        setCroppedImage(result.imageUrl ?? null);
        toast({
          variant: "success",
          title: "Profile picture updated",
          description: "Your new profile picture has been saved",
          showCloseButton: false,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description:
            result.error || "Failed to upload image. Please try again.",
        });
        setCroppedImage(originalImage);
      }
    } catch (error) {
      // Handle any unexpected errors
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "An unexpected error occurred. Please try again.",
      });
      setCroppedImage(originalImage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
      <DialogContent className="max-w-[550px] px-4 py-8 sm:p-12">
        <DialogHeader>
          <DialogTitle className="text-left text-2xl leading-8 font-semibold">
            Profile Picture
          </DialogTitle>

          <DialogDescription className="sr-only">
            Drag to adjust the crop area. The image will be cropped as a square.
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex max-h-[350px] w-full max-w-[450px] justify-center overflow-x-hidden overflow-y-auto">
          {selectedImage && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={1}
              circularCrop={true}
              keepSelection
              className="max-w-full"
            >
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="pointer-events-none"
              />
            </ReactCrop>
          )}
        </div>

        <DialogFooter className="mt-4 flex w-full gap-4 sm:flex-row">
          <Button
            className="border-border w-full"
            variant="outline"
            onClick={() => {
              setIsCropOpen(false);
              setSelectedImage(null);
            }}
          >
            Cancel
          </Button>
          <Button className="w-full" onClick={getCroppedImg}>
            Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

