<script lang="ts">
	export let pageContent: string;

	// import { onMount, onDestroy, tick } from "svelte";
	import Markdown from "svelte-markdown";
	import { scrollPos } from "../stores";
	// onDestroy(() => ($scrollPos = window.scrollY));
	// onMount(async () => {
	// 	await tick();
	// 	console.log($scrollPos);
	// 	window.scrollTo(0, $scrollPos);
	// });
</script>

{#key pageContent}
	<Markdown source={pageContent} />
{/key}
