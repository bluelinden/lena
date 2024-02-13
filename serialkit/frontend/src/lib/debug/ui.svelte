<script lang="ts">
	import { onMount, afterUpdate } from "svelte";
	import type * as SKTypes from "engine/page.types";
	import type { GameStator } from "engine/main";
	import {circIn} from 'svelte/easing';

	export let stator: GameStator;

	let table: HTMLTableElement;
	let aside: HTMLElement;

	$: currentDebugMessages = [] as SKTypes.SKDebugMessage[];

	onMount(() => {
		stator.onDebugMessage((message, messageArray) => {
			currentDebugMessages = messageArray;
		});
	});

	const scrollCallback = (msgs: SKTypes.SKDebugMessage[]) => {
		if (aside && table) {
			aside.scrollTop = table.scrollHeight;
		}
	};

	afterUpdate(() => {
		scrollCallback(currentDebugMessages);
	});

	// $: scrollCallback(currentDebugMessages);
</script>

<aside bind:this={aside}>
	<table bind:this={table}>
		{#if currentDebugMessages.length > 0}
			<thead>
				<tr>
					<th>Category</th>
					<th>Message</th>
				</tr>
			</thead>
		{/if}

		{#each currentDebugMessages as message}
			<tr class:error={message.data.isError} class={message.data.category} class:internal={message.data.isInternal}>
				<td>{message.data.category}</td>
				<td>{message.data.message}</td>
			</tr>
		{/each}
		<div id="anchor" />
	</table>
</aside>

<style lang="scss">
	@use "../tools";

	aside {
		padding-left: 3rem;
		height: calc(100% - 4rem);
		max-height: calc(100vh - 6rem);
		overflow-y: scroll;
		align-self: center;
	}

	td,
	th {
		padding: 0.5rem;
		text-align: start;
		// align to start vertically
		vertical-align: top;
	}

	tr {
		&.load {
			color: brown;
		}
		&.registry {
			color: green;
		}
		&.storage {
			color: deeppink;
		}
		&.error {
			color: red;
		}
		&.init {
			color: gray;
		}
		&.security {
			color: purple;
		}
		&.input {
			color: darkslateblue;
		}
		&.meta {
			color: black;
		}

		&.internal {
			opacity: 0.4;
		}
	}

	table * {
		overflow-anchor: none;
	}

	#anchor {
		overflow-anchor: auto;
		height: 1px;
	}

	* {
		line-height: 1;
		font-family: sans-serif;
		font-size: 1rem;
	}
</style>
