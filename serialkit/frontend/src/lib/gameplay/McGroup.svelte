<script lang="ts">
	import McOption from "./MCOption.svelte";

	export let group: string;
	export let options: { id: string; value: string; label: string }[];
	export let isNumbered: boolean = true;
</script>

{#if isNumbered}
	<ol>
		{#each options as option}
			<McOption id={option.id} value={option.value} {group} on:change
				>{option.label}</McOption
			>
		{/each}
	</ol>
{:else}
	<ul>
		{#each options as option}
			<McOption id={option.id} value={option.value} {group} on:change
				>{option.label}</McOption
			>
		{/each}
	</ul>
{/if}

