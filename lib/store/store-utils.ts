export function clearStorage<T extends { clearData: () => void }>(store: {
  getState: () => T;
  persist: {
    clearStorage?: () => void;
    rehydrate: () => void | Promise<void>;
  };
}) {
  return async function clearStoreStorage() {
    store.getState().clearData();
    store.persist.clearStorage?.();
    await store.persist.rehydrate();
  };
}
