<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { initializeDiscordSdk } from '$lib/discord';

	let { children } = $props();

	onMount(() => {
		initializeDiscordSdk();
	})
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
