<script lang="ts">
	import BottomNav from "./lib/gameplay/BottomNav.svelte";
	import McGroup from "./lib/gameplay/McGroup.svelte";
	import type * as SKTypes from "engine/page.types";
	import type { GameStator } from "engine/main";
	import Markdown from "svelte-markdown";

	const debug: boolean = true;

	export let stator: GameStator;

	$: currentPage = stator.currentPage;

	$: pageContent = currentPage.content;
	$: pageTitle = currentPage.titleMarker;
	$: showBackButton = currentPage.navOptions.allowPrevPage;
	$: showNextButton = currentPage.navOptions.allowNextPage;
	$: goToNextPage = stator.nextPage;
	$: goToPrevPage = stator.prevPage;
	$: multiChoiceQuestion = currentPage.inputDef as
		| SKTypes.SKListInputDef
		| undefined;

	let DebugView: any = null;
	let isShowingDebugView = false;

	$: inputValues = stator.inputValues as Record<string, string>;
	function loadDebug() {
		console.log("Loading debug view...");
		import("./lib/debug/ui.svelte").then((mod) => (DebugView = mod.default));
	}
	stator.onPageChange((newPage) => {
		currentPage = newPage;
	});
</script>

<svelte:head>
	<title>{currentPage.titleMarker}</title>
</svelte:head>

<main>
	<article>
		<!-- keyed due to a bug in svelte-markdown -->
		{#key pageContent}
			<Markdown source={pageContent} />
		{/key}
		{#if multiChoiceQuestion && multiChoiceQuestion.group}
			<McGroup
				group={multiChoiceQuestion.group}
				isNumbered={multiChoiceQuestion.numbered}
				options={multiChoiceQuestion.content() ?? []}
				value={inputValues[multiChoiceQuestion.group ?? ""] ?? ""}
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
	{#if !isShowingDebugView}
		<button
			on:click={() => {
				loadDebug();
				isShowingDebugView = true;
			}}>Open debug view</button
		>
	{/if}
	<svelte:component this={DebugView} {stator} />
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
