<script lang="ts">
	export let pageTitle: string;
	export let showBack: boolean;
	export let showNext: boolean;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	$: nbspTitle = pageTitle.replace(/ /g, "\u00a0");
</script>

<div class="bottom-nav">
	<nav>
		<button
			class="back"
			class:hidden={!showBack}
			disabled={!showBack}
			on:click={() => dispatch("back")}>Back</button
		>

		{#if pageTitle && pageTitle.length > 0}
			<div
				class="h1container"
				class:is-moved-out-of-way={(showBack || showNext) &&
					!(showBack && showNext)}
			>
				<h1>{nbspTitle}</h1>
			</div>
		{/if}

		<button
			class="next"
			class:hidden={!showNext}
			disabled={!showNext}
			on:click={() => dispatch("next")}>Next</button
		>
	</nav>
</div>

<style lang="scss">
	@use "../tools";

	div.bottom-nav {
		width: 100vw;
		position: sticky;
		margin-left: calc(-50vw + 50%);
		bottom: 0;
		background: linear-gradient(#fff0, #fff8);
		backdrop-filter: brightness(57%) contrast(800%) saturate(200%) blur(30px);
		border-radius: 24px 24px 0 0;
		padding-top: 2rem;
		padding-bottom: 2rem;
	}

	nav {
		margin-left: 50%;
		transform: translateX(-50%);
		width: min(100vw, 900px);
		display: flex;
		flex-direction: row;
		justify-content: space-between;


		
		// center items

		align-items: center;


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
			width: 100%;
			h1 {
				transition-property: transform, width;
				transition-timing-function: ease-in-out;
				transition-duration: 3s !important;
				transform: translateX(-50%);
				margin: 0;
			}
			&:has(+ .next.hidden):not(:has(+ .back.hidden)) {
				transform: translateX(50%);
			}

			&:has(+ .back.hidden):not(:has(+ .next.hidden)) {
				transform: translateX(-50%);
			}

			&.is-moved-out-of-way {
				width: max-content;
			}

			pointer-events: none;
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
			padding: 0;
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
