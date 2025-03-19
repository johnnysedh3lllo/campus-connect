import Image from "next/image";
import { Button } from "../ui/button";

export default function ListingCard({ src = "/images/image-house.jpeg", title, location, price }: { src?: string; title: string; location: string; price: string; }) {
    return (
        <article className="px-3 pt-3 pb-4 border rounded-md flex flex-col items-start gap-4" role="listitem">
            <Image src={src} alt={`${title} at ${location}`} width={277.666} height={202} className="rounded-sm w-full" />
            <p className="flex items-center text-sm text-gray-800">
                <Image src={"/icons/icon-location.svg"} alt="Location icon" width={24} height={24} />
                <span>{location}</span>
            </p>
            <h3 className="font-semibold text-2xl leading-6">{title}</h3>
            <div className="w-full flex items-center justify-between gap-4">
                <p className="min-w-0">
                    <span className="font-semibold text-2xl leading-8">${price}</span>/month
                </p>
                <Button
                    variant="outline"
                    className="border-gray-800 text-black hover:bg-gray-200 whitespace-nowrap flex items-center gap-2"
                >
                    View Details
                    <Image src={"/icons/icon-arrow-right.svg"} alt="Arrow icon" width={24} height={24} />
                </Button>
            </div>

        </article>
    );
}