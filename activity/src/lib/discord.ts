import { DiscordSDK } from "@discord/embedded-app-sdk";
import { PUBLIC_DISCORD_CLIENT_ID } from "$env/static/public";

export let discordSdk: DiscordSDK;

export async function initializeDiscordSdk() {
	discordSdk = new DiscordSDK(PUBLIC_DISCORD_CLIENT_ID)
	await discordSdk.ready();
}