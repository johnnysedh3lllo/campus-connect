import { CameraIcon } from "@/public/icons/camera-icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserIcon } from "@/public/icons/user-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { updateProfilePicture } from "@/app/actions/actions";

export function ProfilePictureUpload({
  userId,
  initialAvatarUrl,
}: {
  userId: string;
  initialAvatarUrl: string | null | undefined;
}) {
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);
  const [originalImage, setOriginalImage] = useState<string | null>(
    initialAvatarUrl || null,
  );

  console.log("initial avatar url", initialAvatarUrl);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(
    initialAvatarUrl || null,
  );

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setIsCropOpen(true);
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

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
      const result = await updateProfilePicture(base64Image, userId);
      if (result?.success) {
        setCroppedImage(result.imageUrl ?? null);
        toast({
          title: "Profile picture updated",
          description: "Your new profile picture has been saved",
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
    <>
      <Label className="relative cursor-pointer" htmlFor="profile-image-upload">
        <Avatar className="items-center justify-center overflow-hidden rounded-full bg-gray-100 sm:size-22">
          <AvatarImage
            src={initialAvatarUrl || croppedImage || undefined}
            alt="Profile picture"
          />
          <AvatarFallback className="size-9 overflow-hidden bg-transparent sm:size-full">
            {isUploading ? (
              <Loader2 className="text-muted-foreground z-10 size-6 animate-spin" />
            ) : (
              <UserIcon className="text-muted-foreground" />
            )}
          </AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-full">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}
        <div className="bg-background shadow-lg-2 absolute -right-2 -bottom-3 flex size-8 items-center justify-center rounded-full">
          <CameraIcon />
        </div>
        <Input
          onChange={handleFileChange}
          id="profile-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
        />
      </Label>

      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
            <DialogDescription>
              Drag to adjust the crop area. The image will be cropped as a
              square.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center overflow-hidden py-4">
            {selectedImage && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
                circularCrop={false}
                keepSelection
              >
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-h-[60vh] object-contain"
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCropOpen(false);
                setSelectedImage(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={getCroppedImg}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
