"use client";
import { CameraIcon } from "@/public/icons/camera-icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserIcon } from "@/public/icons/user-icon";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import "react-image-crop/dist/ReactCrop.css";
import { useState } from "react";
import { ProfilePictureUploadProps } from "@/types/prop.types";
import { ProfilePictureUploadModal } from "./modals/profile-picture-upload-modal";
import { toast } from "@/lib/hooks/ui/use-toast";
import { validateImages } from "@/lib/config/app.config";
import {
  MAX_PROFILE_IMAGE_SIZE,
  MIN_PROFILE_IMAGE_SIZE,
} from "@/lib/constants/constants";
import { LoaderIcon } from "@/public/icons/loader-icon";

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

    const isValidImageFileType = validateImages.types.check(fileList);

    const isValidImageSize = validateImages.sizes.single.check(
      fileList,
      MIN_PROFILE_IMAGE_SIZE,
      MAX_PROFILE_IMAGE_SIZE,
    );

    if (!isValidImageFileType) {
      toast({
        variant: "destructive",
        description: validateImages.types.message.default,
        showCloseButton: false,
      });
      return;
    }

    if (!isValidImageSize) {
      toast({
        variant: "destructive",
        description: validateImages.sizes.single.message.profile,
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
              <LoaderIcon className="text-muted-foreground z-10 size-6 animate-spin" />
            ) : (
              <UserIcon className="text-muted-foreground" />
            )}
          </AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-full">
            <LoaderIcon className="text-primary size-8 animate-spin" />
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
