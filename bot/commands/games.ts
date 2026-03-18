import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("games")
	.setDescription("Open games activity");

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const activity = await interaction.launchActivity({ withResponse: true });

	await interaction.followUp('Games activity launched')
}