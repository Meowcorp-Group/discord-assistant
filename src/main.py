#!/usr/bin/env python3
import os
import discord
import assistant_cpp # refer to /src/assistant_cpp.cpp
from dotenv import load_dotenv

load_dotenv()

class BotClient(discord.Client):
	async def on_ready(self):
		print(self.user)
	async def on_message(self, message: discord.Message):
		if message.author == client.user:
			return

		assert self.user is not None
		
		if message.author.id != self.user.id:
			if message.content.startswith('.ping'):
				await message.channel.send('Pong')
			if message.content.startswith('.calc'):
				expression = message.content[len('.calc'):].strip().replace('\\', '')
				try:
					result = assistant_cpp.evaluate_expression(expression)
					embed = discord.Embed(
						title='Qalculate!',
						color=discord.Color.red()
					)
					embed.add_field(name='Input interpretation', value=discord.utils.escape_markdown(result.input), inline=False)
					embed.add_field(name='Result', value=discord.utils.escape_markdown(result.result), inline=False)
					await message.channel.send(embed=embed)
				except Exception as e:
					await message.channel.send(f'Error: {str(e)}')


intents = discord.Intents.default()
intents.message_content = True

client = BotClient(intents=intents)

if __name__ == '__main__':
	client.run(os.getenv('BOT_TOKEN') or '')
