#!/usr/bin/env python3
import os
import discord
import assistant_cpp
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
			if message.content.startswith('.add'):
				# Example usage of the C++ function
				result = assistant_cpp.add(5, 3)
				await message.channel.send(f'The result of adding 5 and 3 is: {result}')


intents = discord.Intents.default()
intents.message_content = True

client = BotClient(intents=intents)

if __name__ == '__main__':
	client.run(os.getenv('BOT_TOKEN') or '')
