<script lang="ts">
  import "@unocss/reset/tailwind.css";
  import Tabs from "$lib/components/tabs.svelte";
  import Menubar from "$lib/components/menubar.svelte";
  import { whoami, current_tab, tabs } from "$lib/stores";
  import { Command } from "@tauri-apps/plugin-shell";
  import { readDir } from "@tauri-apps/plugin-fs";
  import { closeCurrentTab, createTab } from "$lib/utils";
  import { PressedKeys, watch } from "runed";
  const keys = new PressedKeys();

  const isCtrlWPressed = $derived(keys.has("Control", "w"));
  const isCtrlTPressed = $derived(keys.has("Control", "t"));

  let files = $state<string[]>([]);
  let logs = $state<any[]>([]);

  const { children } = $props();

  Command.create("whoami")
    .execute()
    .then(({ stdout }) => whoami.set(stdout.trim()));

  $effect(() => {
    if (isCtrlWPressed) closeCurrentTab();
    if (isCtrlTPressed) createTab();
  });

  $effect(() => {
    const tab = $tabs[$current_tab];

    readDir(tab)
      .then((f) => {
        files = f.map((file) => file.name);
      })
      .catch(console.error);
  });
</script>

<Tabs />
<Menubar />

{logs}

{@render children()}
