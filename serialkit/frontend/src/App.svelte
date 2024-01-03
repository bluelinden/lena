<script lang="ts">
	import BottomNav from "./lib/gameplay/BottomNav.svelte";
	import McOption from "./lib/gameplay/MCOption.svelte";
	import McGroup from "./lib/gameplay/McGroup.svelte";

	let optionIsSelected = false;

</script>

<svelte:head>
	<title>SerialKit</title>
</svelte:head>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />


<main>
	<p>
		Simple design. Simple gameplay. No need to learn the controls. Accessible
		out of the box. Lightweight. Easy to develop for. It's called SerialKit.
		Developed by blue linden in 2024.
	</p>
	<p>I will...</p>
	<McGroup
		group="controls"
		isNumbered={true}
		on:change={(event) => {
			optionIsSelected = true;
		}}
		options={[
			{
				id: "play-game",
				value: "play",
				label: "Play a game",
			},
			{
				id: "read-docs",
				value: "docs",
				label: "Read the docs",
			},
			{
				id: "make-own",
				value: "make",
				label: "Make my own game",
			}
		]}
	/>
</main>
<BottomNav showBack={!optionIsSelected} showNext={optionIsSelected} pageTitle="Gameplay" />

<style>
	main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
</style>
