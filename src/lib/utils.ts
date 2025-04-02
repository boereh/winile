import { current_tab, tabs as _tabs, whoami } from "$lib/stores";
import { get } from "svelte/store";
import { exit } from "@tauri-apps/plugin-process";

export async function closeTab(tab_idx: number) {
  const tabs = get(_tabs);
  const current = get(current_tab);
  const tab_is_most_right = tab_idx === tabs.length - 1;

  // If there's only one tab, exit the app
  if (tabs.length === 1) return exit();

  /** IF
   * - tab bring closed is to the left of the current tab
   * - tab being closed is the most right tab and the current tab
   */
  if (current > tab_idx || (tab_is_most_right && current === tab_idx)) {
    current_tab.update((t) => t - 1);
  }
  _tabs.update((tab) => tab.filter((_, i) => i !== tab_idx));
}

export const closeCurrentTab = () => closeTab(get(current_tab));

export function createTab(path?: string) {
  _tabs.update((tabs) => [
    ...tabs,
    { path: path || `/home/${get(whoami)}`, history: new Map() },
  ]);
  current_tab.update(() => get(_tabs).length - 1);
}
