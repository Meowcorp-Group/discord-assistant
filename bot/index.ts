import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js'
import { readdirSync } from 'node:fs'
import path from 'node:path'
import { exit } from 'node:process'

interface BotClient extends Client {
	commands: Collection<string, any>
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
	]
}) as BotClient

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.commands = new Collection()

const commandFiles = readdirSync(path.join(__dirname, 'commands')).filter((file) =>
	file.endsWith('.ts')
)

for (const file of commandFiles) {
	const filePath = path.join(__dirname, 'commands', file)
	console.log(filePath)
	const { data, execute } = await import(filePath)
	client.commands.set(data.name, { data, execute })
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return
	console.log(interaction)
	const command = client.commands.get(interaction.commandName)
	if (!command) return

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true
			})
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true
			})
		}
	}
})

client.on(Events.MessageCreate, (message) => {
	if (message.author.bot) return
	if (message.content.trim().startsWith(`<@${client.user?.id}>`)) {
		message.reply('meow')
	}
})

if (process.argv.includes('--deploy-commands')) {
	console.log('Deploying commands...')
	try {
		const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!)
		const commands = client.commands.map((cmd) => cmd.data.toJSON())
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(
				process.env.PUBLIC_DISCORD_CLIENT_ID!,
				process.env.DISCORD_BOT_GUILD!
			),
			{ body: commands }
		)

		// @ts-ignore
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error)
	}
	console.log('Done!')
	exit(0)
}

client.login(process.env.DISCORD_BOT_TOKEN)
