import { current_tab, tabs as _tabs } from "$lib/stores";
import { get } from "svelte/store";
import { exit } from "@tauri-apps/plugin-process";

export async function closeTab(tab_idx: number) {
  const tabs = get(_tabs);

  if (tabs.length === 1) return exit();
  if (tab_idx >= tabs.length - 1) current_tab.update((t) => t - 1);
  _tabs.update((tab) => tab.filter((_, i) => i !== tab_idx));
}

export function closeCurrentTab() {
  return closeTab(get(current_tab));
}

export function createTab(path?: string) {
  _tabs.update((tabs) => [...tabs, path || "/home"]);
  current_tab.update(() => get(_tabs).length - 1);
}
