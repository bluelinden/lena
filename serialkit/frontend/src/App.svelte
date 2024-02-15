<script lang="ts">
	import BottomNav from "./lib/gameplay/BottomNav.svelte";
	import McGroup from "./lib/gameplay/MCGroup.svelte";
	import type * as SKTypes from "engine/page.types";
	import type { GameStator } from "engine/main";
	import Markdown from "svelte-markdown";
	import { onMount, onDestroy, tick } from "svelte";
	import { writable } from "svelte/store";
	import { string as mkCurlyQuotes } from "curlyquotes";
	import SKStorage from "../../engine/src/storage";
	import { scrollPos } from "./lib/stores";
	import MdView from "./lib/gameplay/MdView.svelte";

	export let stator: GameStator;

	$: currentPage = stator.currentPage;

	$: pageContent = mkCurlyQuotes(currentPage.content);
	$: pageTitle = currentPage.titleMarker;
	$: showBackButton = currentPage.navOptions.allowPrevPage;
	$: showNextButton = currentPage.navOptions.allowNextPage;
	$: goToNextPage = stator.nextPage;
	$: goToPrevPage = stator.prevPage;
	$: multiChoiceQuestion = currentPage.inputDef as
		| SKTypes.SKListInputDef
		| undefined;

	let DebugView: any = null;
	$: showDebug = false as boolean | undefined;

	$: inputValues = Object.fromEntries(stator.inputValues) as Record<
		string,
		string
	>;
	function loadDebug() {
		if (stator.debug !== true && import.meta.env.DEV !== true) return;
		import("./lib/debug/ui.svelte").then((mod) => (DebugView = mod.default));
	}
	stator.onPageChange((newPage) => {
		currentPage = newPage;
	});
	if (stator.debug === true && import.meta.env.DEV === true)
		onMount(() => {
			loadDebug();
		});

	onMount(() => {
		const delta = 250;
		let lastKeypressTimeLogin = 0;
		window.addEventListener("keydown", (commandSummoner) => {
			if (commandSummoner.key === "q") {
				let thisKeypressTimeLogin = Date.now();
				if (thisKeypressTimeLogin - lastKeypressTimeLogin <= delta) {
					showDebug = !showDebug;
					thisKeypressTimeLogin = 0;
				}
				lastKeypressTimeLogin = thisKeypressTimeLogin;
			}
		});
	});
</script>

<svelte:head>
	<title>{stator.gameName} - {currentPage.titleMarker}</title>
</svelte:head>

<main>
	<article>
		<MdView {pageContent} />

		{#if multiChoiceQuestion && multiChoiceQuestion.group}
			<McGroup
				group={multiChoiceQuestion.group}
				isNumbered={multiChoiceQuestion.numbered}
				options={multiChoiceQuestion.content ?? []}
				value={inputValues[multiChoiceQuestion.group] ?? ""}
				on:change={(e) => {
					stator.callInputChange(e.detail.group, e.detail.value);
					currentPage = currentPage;
					inputValues = inputValues;
					return;
				}}
			/>
		{/if}
	</article>
	<BottomNav
		on:back={() => {
			goToPrevPage();
			currentPage = currentPage;
		}}
		on:next={() => {
			goToNextPage();
			currentPage = currentPage;
		}}
		showBack={showBackButton}
		showNext={showNextButton}
		{pageTitle}
	/>
</main>
{#if stator.debug === true && import.meta.env.DEV === true}
	<svelte:component
		this={DebugView}
		{stator}
		storageCatalog={SKStorage}
		{showDebug}
	/>
{/if}

<style lang="scss">
	@use "./lib/tools.scss";
	article,
	main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		max-width: min(100vw, 900px);
	}

	:global(p) {
		margin-top: 1em;
		margin-bottom: 0;
	}
</style>
