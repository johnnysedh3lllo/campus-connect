"use client";
import { CameraIcon } from "@/public/icons/camera-icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserIcon } from "@/public/icons/user-icon";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import "react-image-crop/dist/ReactCrop.css";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ProfilePictureUploadProps } from "@/lib/prop.types";
import { ProfilePictureUploadModal } from "./modals/profile-picture-upload-modal";
import { toast } from "@/hooks/use-toast";
import { validateFileSizes, validateFileTypes } from "@/lib/app.config";
import {
  MAX_PROFILE_IMAGE_SIZE,
  MIN_PROFILE_IMAGE_SIZE,
} from "@/lib/constants";

export function ProfilePictureUpload({
  initialAvatarUrl,
}: ProfilePictureUploadProps) {
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(
    initialAvatarUrl || null,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);

    const isValidImageFileType = validateFileTypes.check(fileList);

    const isValidImageSize = validateFileSizes.check(
      fileList,
      MIN_PROFILE_IMAGE_SIZE,
      MAX_PROFILE_IMAGE_SIZE,
    );

    if (!isValidImageFileType) {
      toast({
        variant: "destructive",
        description: validateFileTypes.message,
        showCloseButton: false,
      });
      return;
    }

    if (!isValidImageSize) {
      toast({
        variant: "destructive",
        description: validateFileSizes.message.profile,
        showCloseButton: false,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setIsCropOpen(true);
    };

    reader.readAsDataURL(fileList[0]);
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
          accept="image/jpg, image/png, image/webp"
          className="hidden"
        />
      </Label>

      <ProfilePictureUploadModal
        initialAvatarUrl={initialAvatarUrl}
        croppedImage={croppedImage}
        isCropOpen={isCropOpen}
        setIsCropOpen={setIsCropOpen}
        setIsUploading={setIsUploading}
        setCroppedImage={setCroppedImage}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </>
  );
}
