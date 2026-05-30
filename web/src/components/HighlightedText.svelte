<script lang="ts">
  import { splitByKeywords } from "../lib/highlight";

  let {
    text,
    keywords,
  }: {
    text: string;
    keywords: string[];
  } = $props();

  const segments = $derived(splitByKeywords(text, keywords));
</script>

{#each segments as segment, i (i)}
  {#if segment.highlight}
    <mark
      class="rounded-sm bg-amber-200/80 px-0.5 font-[inherit] text-inherit dark:bg-amber-500/35"
      >{segment.text}</mark
    >
  {:else}
    {segment.text}
  {/if}
{/each}
