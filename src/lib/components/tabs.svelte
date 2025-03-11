<script lang="ts">
  import { current_tab, tabs, whoami } from "$lib/stores";
  import WindowButtons from "$lib/components/window-buttons.svelte";
  import IconFolder from "virtual:icons/fluent-emoji/file-folder";
  import IconComputer from "virtual:icons/fluent-emoji/desktop-computer";
  import IconHouse from "virtual:icons/fluent-emoji/house";
  // import IconDismiss from "virtual:icons/fluent/dismiss-16-regular";
  import IconDismiss from "virtual:icons/ph/x";
  import IconAdd from "virtual:icons/fluent/add-24-regular";
  import IconArrow from "virtual:icons/fluent/arrow-left-24-regular";

  function createTab() {
    tabs.update((tabs) => [...tabs, "/home"]);
    current_tab.set($tabs.length - 1);
  }
</script>

<div
  data-tauri-drag-region
  class="bg-zinc-100 flex select-none max-w-full items-center"
>
  <button>
    <IconArrow />
  </button>

  <div
    class="flex font-light items-center text-sm max-w-full overflow-x-auto p-1 pr-0 snap-x snap-mandatory"
    style="scrollbar-width:none"
  >
    {#each $tabs as tab, index}
      <div
        class={[
          "h-9 flex items-center rounded-md transition flex-grow max-w-56 relative group min-w-32 w-screen snap-start",
          index === $current_tab
            ? "bg-white shadow shadow-black/20"
            : "hover:bg-zinc-200",
        ]}
      >
        <button
          onclick={() => current_tab.set(index)}
          class={[
            "flex-grow flex items-center gap-2 cursor-pointer p-2 h-full w-full",
          ]}
        >
          {#if tab === "/"}
            <IconComputer />
          {:else if tab === `/home/${$whoami}`}
            <IconHouse />
          {:else}
            <IconFolder class="mb-0.5" />
          {/if}

          {#if tab === "/"}
            {$whoami}
          {:else if tab === `/home/${$whoami}`}
            Home
          {:else}
            {tab.split("/").at(-1)}
          {/if}
        </button>

        <button
          class={[
            "absolute right-2 grid palce-items-center rounded-md text-xxs p-1.5 hidden group-hover:block transition",
            index === $current_tab ? "hover:bg-zinc-200" : "hover:bg-zinc-300",
          ]}
          onclick={() => {
            current_tab.set(index - 1);
            tabs.update((tabs) => tabs.filter((_, i) => i !== index));
          }}
        >
          <IconDismiss />
        </button>
      </div>

      <div class="h-full w-1 grid place-items-center min-w-1">
        <div
          class={[
            "w-0.5 h-3 block transition",
            [$current_tab - 1, $current_tab].includes(index)
              ? ""
              : "bg-zinc-300",
          ]}
        ></div>
      </div>
    {/each}
  </div>

  <button
    class="h-9 w-9 min-w-9 grid place-items-center rounded-md hover:bg-zinc-200 transition"
    onclick={createTab}
  >
    <IconAdd />
  </button>

  <div class="flex-grow"></div>

  <WindowButtons />
</div>
