import { writable } from "svelte/store";

export const tabs = writable<string[]>(["/home", "/", "/home/benjuntu"]);
export const current_tab = writable(0);
export const whoami = writable("");
