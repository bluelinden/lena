<script lang="ts">
	import type { SKPersistentInputData } from "engine/page.types";
	import McOption from "./MCOption.svelte";

	export let group: string;
	export let options: { id: string; value: string; label: string; isSelected?: boolean }[];
	export let isNumbered: boolean = true;
	export let value: string;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function changeHandler(e: CustomEvent<{ value: string }>) {
		value = e.detail.value;
		options.forEach((option) => {
			option.isSelected = option.value === value;
		})
		dispatch("change", {
			value: e.detail.value,
			group,
		});
	}
</script>

{#if isNumbered}
	<ol>
		{#each options as option}
			<McOption
				id={option.id}
				value={option.value}
				{group}
				selected={option.isSelected ?? false}
				on:change={changeHandler}
				label={option.label}
			></McOption>
		{/each}
	</ol>
{:else}
	<ul>
		{#each options as option}
			<McOption
				id={option.id}
				value={option.value}
				{group}
				selected={option.value === value}
				on:change={changeHandler}
				label={option.label}
			></McOption>
		{/each}
	</ul>
{/if}
