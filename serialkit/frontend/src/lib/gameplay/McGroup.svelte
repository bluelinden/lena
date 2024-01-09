<script lang="ts">
	import McOption from "./MCOption.svelte";

	export let group: string;
	export let options: { id: string; value: string; label: string }[];
	export let isNumbered: boolean = true;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function changeHandler(e: CustomEvent<{ value: string }>) {
		dispatch( "change", {
			value: e.detail.value,
			group
		})
	}
</script>

{#if isNumbered}
	<ol>
		{#each options as option}
			<McOption id={option.id} value={option.value} {group} on:change={changeHandler}
				>{option.label}</McOption
			>
		{/each}
	</ol>
{:else}
	<ul>
		{#each options as option}
			<McOption id={option.id} value={option.value} {group} on:change={changeHandler}
				>{option.label}</McOption
			>
		{/each}
	</ul>
{/if}

