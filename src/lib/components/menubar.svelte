<script lang="ts">
  import { current_tab, tabs, whoami } from "$lib/stores";
  import ArrowLeft from "virtual:icons/ph/arrow-left";
  import ArrowRight from "virtual:icons/ph/arrow-right";
  import Chevron from "virtual:icons/fluent/chevron-right-16-regular";
  import Reload from "virtual:icons/ph/arrow-clockwise";
  import Computer from "virtual:icons/ph/monitor";

  const left_buttons = [
    { icon: ArrowLeft, action() {} },
    { icon: ArrowRight, action() {} },
    { icon: Reload, action() {} },
  ];

  const path = $derived($tabs[$current_tab]);
  const segments = $derived.by(() => {
    if (!path) return [];

    const seg = path.split("/");

    if (seg.length > 1 && seg.at(-1) === "") seg.pop();

    return seg;
  });
</script>

<div class="border-b border-zinc-300 flex gap-1 p-1 font-light select-none">
  {#each left_buttons as button}
    {@const Icon = button.icon}

    <button
      class="w-9 h-9 grid place-items-center hover:bg-zinc-200 rounded transition"
      aria-label="button"
      onclick={button.action}
    >
      <Icon class={"size-5"} />
    </button>
  {/each}

  <div
    class="flex-grow bg-zinc-100 rounded flex items-center p-0.5 h-9 gap-0.5 whitespace-nowrap"
  >
    {#each segments as segment, index}
      {@const is_last = index === $tabs[$current_tab].split("/").length - 1}
      {@const is_first = index === 0}

      <button
        class={[
          "h-full px-2 flex gap-2 items-center hover:bg-zinc-200 rounded transition",
          !is_last ? "" : "hover:(bg-zinc-200 text-black) text-zinc-500",
        ]}
      >
        {#if index === 0}
          <Computer />
          {$whoami}
        {:else}
          {segment}
        {/if}
      </button>

      {#if path !== "/" && !is_last}
        <Chevron class="text-xs" />
      {/if}
    {/each}
  </div>
</div>
