<script lang="ts">
	import McOption from "./MCOption.svelte";

	export let group: string;
	export let options: {
		id: string;
		value: string;
		label: string;
	}[];

	export let isNumbered: boolean = true;
	export let value: string;

	import { createEventDispatcher, onMount } from "svelte";
	const dispatch = createEventDispatcher();

	function changeHandler(e: CustomEvent<{ value: string }>) {
		value = e.detail.value;
		dispatch("change", {
			value,
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
				selected={option.value === value}
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
