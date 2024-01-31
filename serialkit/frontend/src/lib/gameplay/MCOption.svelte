<script lang="ts">
	export let group: string;
	export let value: string;
	export let id: string;

	export let selected: boolean;

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
</script>

<!-- class:checked is here because of firefox stupidity and :has not refreshing when it should -->
<li class:checked={selected}>
	<label for={id}><slot>SerialKit: Option empty.</slot></label>

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
	/>
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

		&:hover,
		&:has(+ input:checked) {
			text-underline-offset: 0.2em;
			text-decoration-thickness: 0.15em;
			text-shadow: #0095 0 0 5px;
		}
	}
</style>
