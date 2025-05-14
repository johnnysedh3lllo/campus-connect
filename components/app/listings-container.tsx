"use client";

import { ListingContainerTenant } from "./listing-container-tenant";
import { ListingContainerLandlord } from "./listing-container-landlord";

export function ListingContainer() {
  return (
    <>
      <ListingContainerLandlord />
      <ListingContainerTenant />
    </>
  );
}
