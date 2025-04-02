<script lang="ts">
  import "@unocss/reset/tailwind.css";
  import Tabs from "$lib/components/tabs.svelte";
  import Menubar from "$lib/components/menubar.svelte";
  import { whoami, current_tab, tabs } from "$lib/stores";
  import { Command } from "@tauri-apps/plugin-shell";
  import { readDir } from "@tauri-apps/plugin-fs";
  import { closeCurrentTab, createTab } from "$lib/utils";
  import { PressedKeys, watch } from "runed";

  const pressed_keys = new PressedKeys();

  const isCtrlWPressed = $derived.by(() => {
    let keys = ["Control", "w"];
    if (keys.length !== pressed_keys.all.length) return false;
    return keys.every((key) => pressed_keys.has(key));
  });
  const isCtrlTPressed = $derived.by(() => {
    let keys = ["Control", "t"];
    if (keys.length !== pressed_keys.all.length) return false;
    return keys.every((key) => pressed_keys.has(key));
  });
  const isCtrlTabPressed = $derived.by(() => {
    let keys = ["Control", "tab"];
    if (keys.length !== pressed_keys.all.length) return false;
    return keys.every((key) => pressed_keys.has(key));
  });
  const isCtrlShiftTabPressed = $derived.by(() => {
    let keys = ["Control", "Shift", "tab"];
    if (keys.length !== pressed_keys.all.length) return false;
    return keys.every((key) => pressed_keys.has(key));
  });

  const { children } = $props();

  Command.create("whoami")
    .execute()
    .then(({ stdout }) => {
      whoami.set(stdout.trim());

      tabs.set([
        {
          path: `/home/${stdout.trim()}`,
          history: new Map(),
        },
        {
          path: "/var",
          history: new Map(),
        },
        {
          path: "/usr/share",
          history: new Map(),
        },
      ]);
      current_tab.set(0);
    });

  $effect(() => {
    if (isCtrlWPressed) closeCurrentTab();
    if (isCtrlTPressed) createTab();
    if (isCtrlTabPressed)
      current_tab.update((c) => (c >= $tabs.length - 1 ? c : c + 1));
    if (isCtrlShiftTabPressed) {
      console.log("shift tab");

      current_tab.update((c) => (c < 1 ? c : c - 1));
    }
  });
</script>

<div class="w-screen h-screen overflow-hidden flex flex-col">
  <Tabs />
  <Menubar />

  <div class="flex-grow flex">
    <div></div>
    {@render children()}
  </div>
</div>
