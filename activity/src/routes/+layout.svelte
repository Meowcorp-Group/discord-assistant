<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
	import { DiscordSDK } from '@discord/embedded-app-sdk';

	let { children } = $props();

	// onMount(async () => {
	// 	console.log('Mounting layout...');
	// 	// await initializeDiscordSdk();
	// 	const discordSdk = new DiscordSDK(PUBLIC_DISCORD_CLIENT_ID);
	// 	await discordSdk.ready();

	// 	console.log('Discord SDK initialized:', discordSdk);

	// 	const { code } = await discordSdk.commands.authorize({
	// 		client_id: PUBLIC_DISCORD_CLIENT_ID,
	// 		response_type: 'code',
	// 		state: '',
	// 		prompt: 'none',
	// 		scope: [
	// 			'identify',
	// 			'guilds'
	// 		]
	// 	})

	// 	const response = await fetch('/api/token', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({ code })
	// 	})
	// 	const data = await response.json();
	// 	const auth = await discordSdk.commands.authenticate({
	// 		access_token: data.access_token
	// 	})

	// 	if (!auth) throw new Error('Failed to authenticate with Discord');

	// 	console.log('Authenticated with Discord:', auth);
	// })
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<main class="p-4 flex">
	{@render children()}
</main>
