import { writable } from "svelte/store";

export type Entry = {
  name: string;
  type: string;
  icon?: string;
};

export type Tab = {
  path: string;
  history: Map<number, string>;
};

export type CachedPath = {
  path: string;
  entries: Entry[];
};

export const tabs = writable<Tab[]>([]);
export const current_tab = writable(-1);
export const whoami = writable("");
