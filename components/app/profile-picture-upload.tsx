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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { updateProfilePicture } from "@/app/actions/actions";
import { ProfilePictureUploadProps } from "@/lib/component-prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ProfilePictureUpload({
  userId,
  initialAvatarUrl,
}: ProfilePictureUploadProps) {
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);
  const [originalImage, setOriginalImage] = useState<string | null>(
    initialAvatarUrl || null,
  );
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

  const { toast } = useToast();

  const queryClient = useQueryClient();
  const updateProfilePictureMutation = useMutation({
    mutationFn: async ({
      base64Image,
      userId,
    }: {
      base64Image: string;
      userId: string;
    }) => {
      return await updateProfilePicture(base64Image, userId);
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", variable.userId],
      });

      // queryClient.setQueryData(["userProfile", variable.userId], (oldData) => {
      //   oldData
      //     ? { ...oldData, avatar_url: `${data.imageUrl}?t=${Date.now()}` }
      //     : oldData;
      // });
    },
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

  // TODO: ANALYZE THIS FUNCTION
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

  // TODO: ANALYZE THIS FUNCTION
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
      const result = await updateProfilePictureMutation.mutateAsync({
        base64Image,
        userId,
      });

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
          <AvatarImage src={croppedImage || undefined} alt="Profile picture" />
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
        <DialogContent className="max-w-3xl px-4 py-8 sm:p-12">
          <DialogHeader>
            <DialogTitle className="text-left text-2xl leading-8 font-semibold">
              Profile Picture
            </DialogTitle>

            <DialogDescription>
              Drag to adjust the crop area. The image will be cropped as a
              square.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center overflow-hidden">
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
                  className="max-h-[30vh] object-contain"
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter className="flex w-full gap-4 sm:flex-row">
            <Button
              className="border-border"
              width={"full"}
              variant="outline"
              onClick={() => {
                setIsCropOpen(false);
                setSelectedImage(null);
              }}
            >
              Cancel
            </Button>
            <Button width={"full"} onClick={getCroppedImg}>
              Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
