#!/usr/bin/env python3
import os
import discord
from dotenv import load_dotenv

load_dotenv()

class BotClient(discord.Client):
	async def on_ready(self):
		print(self.user)
	async def on_message(self, message: discord.Message):
		if message.author == client.user:
			return
		
		if message.author.id != self.user.id:
			if message.content.startswith('.ping'):
				await message.channel.send('Pong')


intents = discord.Intents.default()
intents.message_content = True

client = BotClient(intents=intents)

if __name__ == '__main__':
	client.run(os.getenv('BOT_TOKEN') or '')
