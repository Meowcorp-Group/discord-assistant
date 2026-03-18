import { Client, Events, GatewayIntentBits } from 'discord.js'

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
	]
})

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.on(Events.MessageCreate, (message) => {
	if (message.author.bot) return
	if (message.content.trim().startsWith(`<@${client.user?.id}>`)) {
		message.reply('meow')
	}
})

client.login(process.env.DISCORD_BOT_TOKEN)