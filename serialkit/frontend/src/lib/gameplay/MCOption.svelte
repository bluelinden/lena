<script lang="ts">
	export let group: string;
	export let value: string;
	export let id: string;

	export let selected: boolean;

	export let label: string;

	import { createEventDispatcher } from "svelte";
	import { string as cqString } from "curlyquotes";
	import SvelteMarkdown from "svelte-markdown";

	$: labelCurly = cqString(label);

	let labelElem: HTMLLabelElement;

	const dispatch = createEventDispatcher();
</script>

<li class:checked={selected}>
	<input
		type="radio"
		autocomplete="off"
		name={group}
		{id}
		{value}
		checked={selected}
		on:change={() => {
			value = value;
			selected = selected;
			dispatch("change", {
				value,
			});
			
		}}
		on:click={() => {
			labelElem.scrollIntoView({ behavior: "instant" });
		}}
	/>

	<label for={id} bind:this={labelElem}
		><SvelteMarkdown isInline={true} source={labelCurly} />
	</label>
</li>

<style lang="scss">
	@use "../tools";
	li {
		margin: 0.5rem 0;
		transition: all 0.2s ease-in-out;
		margin-left: 2em;
		color: #009a;

		&.checked {
			margin-left: 0;
			color: #009;
			&::marker {
				content: "> ";
			}
		}
	}

	input {
		clip-path: polygon(0 0);
		position: absolute;
		top: 0;
	}
	label {
		@include tools.stdfont;
		background: #fff;
		border: none;
		cursor: pointer;
		text-decoration-skip-ink: auto;
		text-decoration-line: underline;
		text-decoration-thickness: 0.07em;
		text-underline-offset: 0.1em;
		color: var(--color);
		transition: all 0.1s ease-in-out;
		text-decoration-style: solid;
		text-shadow: none;

		&:hover {
			text-underline-offset: 0.2em;
			text-decoration-thickness: 0.15em;
			text-shadow: #0095 0 0 5px;
		}
	}

	.checked label, .checked label * {
		text-underline-offset: 0.2em;
		text-decoration-thickness: 0.15em;
		text-shadow: #0095 0 0 5px;
	}
</style>
