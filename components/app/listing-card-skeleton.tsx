import React from "react";

function ListingCardSkeleton() {
    return (
        <div className="relative z-2 sm:flex w-full max-w-79 flex-col items-stretch gap-4 rounded-md border px-3 pt-3 pb-4">
            <div className="relative z-0 aspect-[288/208] h-52 w-full animate-pulse rounded-md bg-gray-200" />

            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-6 w-40 animate-pulse rounded-md bg-gray-200" />
                </div>

                <div className="h-8 w-56 animate-pulse rounded-md bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 items-center">
                <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />

                <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
            </div>
        </div>
    );
}

export default ListingCardSkeleton;
