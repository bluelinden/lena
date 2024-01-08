<script lang="ts">
	export let pageTitle: string;
	export let showBack: boolean;
	export let showNext: boolean;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
</script>

<nav>
	<button class="back" class:hidden={!showBack} disabled={!showBack} on:click={() => dispatch("back")}>Back</button>

	{#if pageTitle && pageTitle.length > 0}
		<div class="h1container"><h1>{pageTitle}</h1></div>
	{/if}

	<button class="next" class:hidden={!showNext} disabled={!showNext} on:click={() => dispatch("next")}>Next</button>
</nav>

<style lang="scss">
	@use "../tools";

	nav {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		// center items

		align-items: center;
		padding: 0.5rem;
		button {
			@include tools.stdhoverbutton;
			--color: #009a;
			&:disabled {
				pointer-events: none;
			}
		}

		.h1container {
			transform: translateX(50%);
			flex-grow: 0;
			width: fit-content;
			h1 {
				transition-property: transform, width;
				transition-timing-function: ease-in-out;
				transition-duration: 3s !important;
				transform: translateX(-50%);
			}
			&:has(+ .next.hidden):not(:has(+ .back.hidden)) {
				transform: translateX(50%);
			}

			&:has(+ .back.hidden):not(:has(+ .next.hidden)) {
				transform: translateX(-50%);
			}
		}

		* {
			text-align: center;
			width: 100%;
			flex-grow: 1;
			transition-timing-function: ease-in-out;
			transition-duration: 0.2s !important;
		}
		.hidden {
			width: 0;
			opacity: 0;
			flex-shrink: 1;
		}
		.back {
			text-align: left;
		}

		.next {
			text-align: right;
		}
	}
</style>
