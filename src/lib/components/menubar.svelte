<script lang="ts">
  import { current_tab, tabs, whoami } from "$lib/stores";
  import ArrowLeft from "virtual:icons/ph/arrow-left";
  import ArrowRight from "virtual:icons/ph/arrow-right";
  import Chevron from "virtual:icons/fluent/chevron-right-16-regular";
  import Reload from "virtual:icons/ph/arrow-clockwise";
  import IconSearch from "virtual:icons/ph/magnifying-glass";
  import IconMenu from "virtual:icons/ph/list";
  import IconHouse from "virtual:icons/ph/house";
  import Computer from "virtual:icons/ph/monitor";
  import type { Component } from "svelte";

  type MenuButtonOptions = {
    class: string[];
    action: () => any;
    icon: Component;
    disabled?: boolean;
  };

  const home_folders = [
    "Desktop",
    "Documents",
    "Downloads",
    "Music",
    "Pictures",
    "Videos",
  ];

  const home_path = $derived(`/home/${$whoami}`);
  const tab = $derived($tabs[$current_tab]);
  const tab_has_prev = $derived(tab ? tab.history.has(-1) : false);
  const tab_has_next = $derived(tab ? tab.history.has(1) : false);

  $inspect(tab, tab_has_next, tab_has_prev, tab.history.get(-1));
  const left_buttons = [
    { icon: ArrowLeft, action() {} },
    { icon: ArrowRight, action() {} },
    { icon: Reload, action() {} },
  ];
  const segments = $derived.by(() => {
    if (!tab) return [];
    let has_home = false;

    for (const folder of home_folders) {
      if (tab.path.startsWith(`${home_path}/${folder}`)) {
        const p = tab.path.slice(`${home_path}/${folder}`.length);

        if (p.startsWith("/")) {
          return [home_path, folder, ...p.slice(1).split("/")];
        }

        return [`${home_path}/${folder}`];
      }
    }

    if (tab.path === home_path) return [home_path];
    if (tab.path.startsWith(home_path)) {
      return [home_path, ...tab.path.slice(home_path.length + 1).split("/")];
    }

    const seg = tab.path.split("/");
    if (seg.length > 1 && seg.at(-1) === "") seg.pop();

    return seg;
  });
</script>

{#snippet menu_button(opts: MenuButtonOptions)}
  <button
    class={[
      "w-9 h-9 grid place-items-center hover:bg-zinc-200 rounded transition disabled:(bg-red-500)",
      ...opts.class,
    ]}
    disabled={opts.disabled}
    aria-label="button"
    onclick={opts.action}
  >
    {tab_has_next}
    <opts.icon class={"size-5"} />
  </button>
{/snippet}

<div class="border-b border-zinc-300 flex gap-1 p-1 font-light select-none">
  {@render menu_button({
    icon: ArrowLeft,
    class: [],
    disabled: tab_has_prev,
    action() {},
  })}

  {@render menu_button({
    icon: ArrowRight,
    class: [],
    disabled: tab_has_next,
    action() {},
  })}

  {@render menu_button({
    icon: Reload,
    class: [],
    action() {},
  })}

  <div
    class="flex-grow bg-zinc-100 rounded flex items-center p-0.5 h-9 gap-0.5 whitespace-nowrap"
  >
    {#each segments as segment, index}
      {@const is_last =
        index === $tabs[$current_tab].path.split("/").length - 1}
      {@const is_first = index === 0}

      <button
        class={[
          "h-full px-2 flex gap-2 items-center hover:bg-zinc-200 rounded transition",
          !is_last ? "" : "hover:(bg-zinc-200 text-black) text-zinc-500",
        ]}
      >
        {#if home_path === tab.path}
          <IconHouse />

          Home
        {:else if index === 0}
          <Computer />
          PC
        {:else}
          {segment}
        {/if}
      </button>

      {#if segments.length > 1}
        <Chevron class="text-xs" />
      {/if}
    {/each}
  </div>

  <div class="relative w-1/5 min-w-xs flex items-center">
    <IconSearch
      class="absolute left-2 opacity-40 pointer-events-none peer-focus:(opacity-100 bg-red-500) transition"
    />

    <input
      type="text"
      placeholder="Search current folder"
      class="bg-zinc-100 h-9 p-2 pl-9 w-full rounded flex items-center outline-none peer"
    />
  </div>

  <button class="w-9 h-9 hover:bg-zinc-200 rounded-md grid place-items-center">
    <IconMenu />
  </button>
</div>
