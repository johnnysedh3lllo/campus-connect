import { useRouter } from "next/navigation";
import { ResponsiveHeaderProps } from "@/lib/prop.types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KabobIcon } from "@/public/icons/kabob-icon";
import { BackIcon } from "@/public/icons/back-icon";
import { EditIcon } from "@/public/icons/edit-icon";
import { TrashIconOutlined } from "@/public/icons/icon-trash-outlined";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";

export function ListingDetailResponsiveHeader({
  title,
  subtitle,
  onEditClick,
  onDeleteClick,
  publicationStatus,
  handlePublish,
  handleUnpublish,
}: ResponsiveHeaderProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(
    publicationStatus === "published" ? "published" : "unpublished",
  );

  async function handleValueChange(value: string) {
    if (!value) return;
    if (value === "published") {
      await handlePublish();
    } else if (value === "unpublished") {
      await handleUnpublish();
    }
  }

  return (
    <header className="flex flex-col justify-between gap-4 pb-4 sm:flex-row sm:items-center">
      <div className="flex w-full items-center gap-3">
        <BackIcon className="cursor-pointer" onClick={() => router.back()} />
        <section className="mx-4 hidden flex-grow sm:block">
          <h1 className="text-2xl leading-10 font-semibold capitalize sm:text-4xl sm:leading-11">
            {title}
          </h1>
          <p className="text-text-secondary flex items-center gap-2 text-sm leading-6">
            {subtitle}
          </p>
        </section>
        <div className="ml-auto flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={selectedOption}
            onValueChange={handleValueChange}
            className="text-text-secondary grid max-w-52 grid-cols-2 items-center justify-between gap-3 rounded-sm border p-1"
          >
            <ToggleGroupItem
              value="published"
              className="data-[state=on]:bg-background-accent hover:bg-background-secondary hover:text-text-primary truncate rounded-sm px-4 py-2 leading-6 hover:rounded-sm focus:rounded-sm data-[state=on]:rounded-sm data-[state=on]:text-white"
            >
              {selectedOption === "published" ? "Published" : "Publish"}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="unpublished"
              className="data-[state=on]:bg-background-accent hover:bg-background-secondary hover:text-text-primary rounded-sm px-4 py-2 leading-6 hover:rounded-sm focus:rounded-sm data-[state=on]:rounded-sm data-[state=on]:text-white"
            >
              {selectedOption !== "published" ? "Unpublished" : "Unpublish"}
            </ToggleGroupItem>
          </ToggleGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-sm p-2">
                <KabobIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="rounded-sm p-2"
                onClick={onEditClick}
              >
                <EditIcon color="black" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-sm p-2"
                onClick={onDeleteClick}
              >
                <TrashIconOutlined color="red" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <section className="mx-4 block flex-grow sm:hidden">
        <h1 className="text-2xl leading-10 font-semibold capitalize sm:text-4xl sm:leading-11">
          {title}
        </h1>
        <p className="text-text-secondary flex items-center gap-2 text-sm leading-6">
          {subtitle}
        </p>
      </section>
    </header>
  );
}
