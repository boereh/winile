<script lang="ts">
  import { getCurrentWindow, type Window } from "@tauri-apps/api/window";
  import Minus from "virtual:icons/fluent/subtract-12-regular";
  import Maximize from "virtual:icons/fluent/square-12-regular";
  import Unmaximize from "virtual:icons/fluent/square-multiple-16-regular";
  import Dismiss from "virtual:icons/fluent/dismiss-16-regular";
  import { onMount } from "svelte";

  let tauri_window = $state<Window>();

  let is_max = $state(false);
  const buttons = [
    {
      icon: Minus,
      action: () => tauri_window?.minimize(),
    },
    {
      icon: "maximize",
      action: () => tauri_window?.maximize(),
    },
    {
      icon: "close",
      action: () => tauri_window?.close(),
    },
  ];
  const base_classes =
    "w-6 h-6 grid place-items-center bg-zinc-200 hover:bg-zinc-300 rounded-full transition";

  try {
    const t_window = getCurrentWindow();
    tauri_window = t_window;

    t_window.onResized(async () => (is_max = await t_window.isMaximized()));
  } catch (c) {}

  onMount(async () => (is_max = (await tauri_window?.isMaximized()) || false));
</script>

<div class="h-9 flex gap-2 p-1 items-center">
  <button class={[base_classes]} onclick={() => tauri_window?.minimize()}>
    <Minus class="size-3" />
  </button>

  <button class={[base_classes]} onclick={() => tauri_window?.toggleMaximize()}>
    {#if is_max}
      <Unmaximize class="size-4" />
    {:else}
      <Maximize class="size-3" />
    {/if}
  </button>

  <button class={[base_classes]} onclick={() => tauri_window?.close()}>
    <Dismiss class="size-3" />
  </button>
</div>
