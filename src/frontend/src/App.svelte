<script lang="ts">
	import BottomNav from "./lib/gameplay/BottomNav.svelte";
	import McGroup from "./lib/gameplay/McGroup.svelte";
	import type * as SKTypes from "engine/page.types";
	import type { GameStator } from "engine/main";
	import Markdown from "svelte-markdown";

	export let stator: GameStator;

	$: currentPage = stator.currentPage;

	$: pageContent = currentPage.content;
	$: pageTitle = currentPage.titleMarker;
	$: showBackButton = currentPage.navOptions.allowPrevPage;
	$: showNextButton = currentPage.navOptions.allowNextPage;
	$: goToNextPage = stator.nextPage;
	$: goToPrevPage = stator.prevPage;
	$: multiChoiceQuestion = currentPage.inputDef;
	$: inputValues = currentPage.inputValues;

	stator.onPageChange((newPage) => {
		currentPage = newPage;
	});
</script>

<svelte:head>
	<title>{currentPage.titleMarker}</title>
</svelte:head>

<main>
	<Markdown source={currentPage.content} />
	{#if multiChoiceQuestion}
		<McGroup
			group={multiChoiceQuestion?.group ?? "group"}
			isNumbered={multiChoiceQuestion?.numbered}
			options={multiChoiceQuestion?.content ?? []}
			on:change={(e) => {
				stator.callInputChange(e.detail.group, e.detail.value);
				currentPage = currentPage;
				return;
			}}
		/>
	{/if}
</main>
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

<style>
	main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
</style>
