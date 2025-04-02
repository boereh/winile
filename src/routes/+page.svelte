<script lang="ts">
  import IconFolder from "virtual:icons/fluent-emoji/file-folder";
  import IconFolderOpen from "virtual:icons/fluent-emoji/open-file-folder";
  import IconFile from "virtual:icons/fluent-emoji/page-facing-up";
  import LogoRust from "virtual:icons/logos/rust";
  import LogoNodeJS from "virtual:icons/logos/nodejs-icon";
  import LogoBash from "virtual:icons/logos/bash-icon";
  import IconPassword from "virtual:icons/ph/password-fill";
  import { readDir, type DirEntry } from "@tauri-apps/plugin-fs";
  import { Command, Child } from "@tauri-apps/plugin-shell";
  import { current_tab, tabs, whoami } from "$lib/stores";
  import "virtual:uno.css";
  import { info } from "@iconify-json/fluent/index.js";

  type Entry = {
    name: string;
    type: "dir" | "file" | "link";
  };

  const icons = [
    {
      is: [".cargo", ".rustup"],
      icon: LogoRust,
    },
    {
      is: ["node_modules", ".npm"],
      icon: LogoNodeJS,
    },
    {
      is: [".bashrc", ".bash_history"],
      icon: LogoBash,
    },
    {
      is: [".bashrc", ".bash_history"],
      icon: LogoBash,
    },
  ];

  let sudo_command = $state<Child | null>(null);
  let entries = $state<Entry[]>([]);

  $effect(() => {
    if ($tabs.length === 0) return;
    if ($current_tab === -1) return;

    listDirectory();

    // readDir($tabs[$current_tab])
    //   .then((res) => {
    //     entries = res.sort((a, b) => {
    //       if (a.isDirectory && b.isFile) return -1;
    //       if (a.isFile && b.isDirectory) return 1;
    //       return a.name.localeCompare(b.name);
    //     });
    //   })
    //   .catch(async (err: string) => {
    //     console.log(`readDir error: "${err}"`);

    //     listDirectory();
    //   });
  });

  async function listDirectory() {
    const { stdout } = await Command.create("ls", [
      "-la",
      $tabs[$current_tab].path,
    ]).execute();

    entries = [];

    for (const entry of stdout.split("\n").slice(3, -1)) {
      let type: Entry["type"] = "file";

      if (entry.startsWith("d")) type = "dir";
      if (entry.startsWith("l")) type = "link";

      entries.push({
        name: entry.split(" ").at(-1) || "",
        type,
      });
    }
  }

  function followDirectory(name: string) {
    const new_tabs = $tabs.map((tab, index) => {
      if (index !== $current_tab) return tab;
      const path = `${tab.path}/${name}`;

      for (const [index, entry] of tab.history.entries()) {
        if (index > 0) continue;

        tab.history.set(index - 1, entry);
      }

      tab.history.set(0, path);

      console.log(tab.history);

      return {
        path,
        history: tab.history,
        entries: [],
      };
    });

    tabs.update(() => new_tabs);
  }
</script>

<div class="p-2 overflow-y-auto flex-grow">
  <div class="flex flex-wrap gap-2 gap-2">
    {#each entries as entry}
      <button
        class="flex flex-col items-center justify-center focus:bg-zinc-100 aspect-square rounded-md h-32 w-32 transition p-2"
        onclick={(event) => {
          if (event.detail !== 2) return;
          if (entry.type === "dir") followDirectory(entry.name);
        }}
      >
        <div class="flex items-center justify-center relative">
          {#if entry.type === "dir"}
            <IconFolder class="size-20" />
          {:else if entry.type === "file"}
            <IconFile class="size-20" />
          {/if}

          {#each icons as icon}
            {#if icon.is.includes(entry.name)}
              <icon.icon
                class={[
                  "absolute size-4",
                  entry.type === "dir"
                    ? "right-3 bottom-3"
                    : "right-4 bottom-2",
                ]}
              />
            {/if}
          {/each}
        </div>

        <span class="text-xs max-w-full break-words">{entry.name}</span>
      </button>
    {/each}
  </div>
</div>

{JSON.stringify($tabs[$current_tab])}

{#if sudo_command}
  <div class="bg-white/75 fixed inset-0 grid place-items-center">
    <div class="bg-white p-4 border border-zinc-200 rounded-md space-y-4">
      <p>Password for {$whoami}</p>

      <div class="relative flex items-center">
        <IconPassword class="absolute left-2 text-zinc-400 size-5" />

        <input
          type="password"
          placeholder="Password"
          class="pr-2 pl-10 h-9 outline-none bg-zinc-100 w-full rounded"
          onsubmit={() => {}}
        />
      </div>
    </div>
  </div>
{/if}
