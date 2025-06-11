import { create } from "zustand";

type SearchStoreState = {
  query: string;
  setQuery: (q: string) => void;
};

export function createSearchStore() {
  return create<SearchStoreState>((set) => ({
    query: "",
    setQuery: (q) => set({ query: q }),
  }));
}
