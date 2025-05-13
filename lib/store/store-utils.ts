import { useCreateListingsStore } from "./create-listings-store";

export function useClearListingStore() {
  return async function clearStoreStorage() {
    useCreateListingsStore.getState().clearData();
    useCreateListingsStore.persist.clearStorage?.();
    await useCreateListingsStore.persist.rehydrate();
  };
}
