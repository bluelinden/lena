<script lang="ts">
	import { onMount, afterUpdate } from "svelte";
	import type * as SKTypes from "engine/page.types";
	import type { GameStator } from "engine/main";
	import { circIn } from "svelte/easing";
	import type { StorageCatalog } from "../../../../engine/src/storage";

	export let showDebug: boolean = true;

	export let storageCatalog: StorageCatalog;

	export let stator: GameStator;

	let table: HTMLTableElement;
	let aside: HTMLElement;

	let skipIntro = storageCatalog
		.open("gamesettings")
		.get("skip-intro") as boolean;

	function skipIntroHandler() {
		if (skipIntro) {
			storageCatalog.open("gamesettings").set("skip-intro", false);
		} else {
			storageCatalog.open("gamesettings").set("skip-intro", true);
		}
		storageCatalog.open("gamesettings").commit();
	}

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

	$: nsToClear = "";
	const clearNS = () => {
		if (nsToClear === "*") {
			storageCatalog.clearAll();
			nsToClear = "";
		} else if (nsToClear.includes(" ")) {
			nsToClear.split(" ").forEach((ns) => {
				storageCatalog.open(ns).clear();
				nsToClear = "";
			});
		} else {
			storageCatalog.open(nsToClear).clear();
			nsToClear = "";
		}
	};

	// $: scrollCallback(currentDebugMessages);
</script>

<aside class:hidden={!showDebug} bind:this={aside}>
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
			<tr
				class:error={message.data.isError}
				class={message.data.category}
				class:internal={message.data.isInternal}
			>
				<td>{message.data.category}</td>
				<td>{message.data.message}</td>
			</tr>
		{/each}
		<div id="anchor" />
	</table>
	<div id="clear-ns">
		<input
			type="text"
			bind:value={nsToClear}
			on:keydown={(e) => {
				if (e.key === "Enter") {
					clearNS();
				}
			}}
		/>

		<button type="submit" on:click={clearNS}>Clear Namespace</button>
	</div>
	<input
		type="checkbox"
		id="use-intro"
		name="use-intro"
		checked={skipIntro}
		on:change={skipIntroHandler}
	/>
	<label for="use-intro">Skip Intro</label>
</aside>

<style lang="scss">
	@use "../tools";

	aside {
		margin-left: 3rem;
		height: calc(100% - 4rem);
		max-height: calc(100vh - 6rem);
		overflow-y: scroll;
		align-self: center;
		max-width: 25vw;
		position: static;
		z-index: 1000;
		&.hidden {
			display: none !important;
		}
		* {
			max-width: 25vw !important;
		}
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

	#clear-ns {
		display: flex;
		gap: 0.5rem;
		width: 100%;
		input[type="text"] {
			flex: 1;
		}
	}

	* {
		line-height: 1;
		font-family: sans-serif;
		font-size: 1rem;
	}
</style>
