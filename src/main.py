import os
import re
import psutil
import getpass
import time
import discord
from discord.ext import tasks
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()

# blacklisted apps to notify when they start
blacklist = [
	{
		'name': 'Test App',
		'binaries': ['kdialog'],
		'args': ['Blacklist Test App']
	},
	{
		'name': 'Geometry Dash',
		'binaries': ['GeometryDash.ex', 'GeometryDash.exe', 'Geometry Dash.app']
	},
	{
		'name': 'Growtopia',
		'binaries': ['Growtopia.exe']
	},
	{
		'name': 'Cubic Castles',
		'binaries': ['Cubic.exe']
	},
	{
		'name': 'All The Mods 9',
		'binaries': ['java', 'javaw', 'java.exe', 'javaw.exe'],
		'args': ['All The Mods 9', 'ATM9']
	},
	{
		'name': 'EA SPORTS™ FIFA 23',
		'binaries': ['FIFA23.exe', 'FIFA23_Trial.exe']
	},
	{
		'name': 'EA SPORTS FC™ 24',
		'binaries': ['FC24.exe', 'FC24_Trial.exe']
	}
]

channel = int(os.getenv('CHANNEL_ID'))

# globals
last_processes = set()

intents = discord.Intents.default()
client = discord.Client(intents=intents)

@client.event
async def on_ready():
	print(f'Logged in as {client.user}')
	monitor.start()

@tasks.loop(seconds=1)
async def monitor():
	global last_processes
	processes = get_processes(getpass.getuser())
	if len(last_processes) == 0:
		last_processes = set(processes)

	current_processes = set(processes)
	new_processes = current_processes - last_processes

	for proc in new_processes:
		try:
			blacklisted = next((app for app in blacklist if proc.name() in app['binaries']), None)
		except psutil.NoSuchProcess:
			continue
		if blacklisted is not None:
			if 'args' in blacklisted is not None and not re.findall(r"(?=("+'|'.join(blacklisted['args'])+r"))", ' '.join(proc.cmdline())):
				continue
			await client.get_channel(channel).send(f'<@{os.getenv('USER_ID')}> has started **{blacklisted['name']}**', view=ProcessActions(proc.pid, blacklisted))

	last_processes = current_processes

class ProcessActions(discord.ui.View):
	def __init__(self, pid, blacklist):
		super().__init__()
		self.pid = pid
		self.blacklist = blacklist

	@discord.ui.button(label='Kill', emoji=chr(0x1F480))
	async def kill(self, interaction: discord.Interaction, button: discord.ui.Button):
		try:
			psutil.Process(self.pid).kill()
			await interaction.response.send_message(content='Successfully killed')
		except psutil.Error as e:
			await interaction.response.send_message(content=f'Failed to kill: `{e}`')

	@discord.ui.button(label='Info', emoji=chr(0x2139) + chr(0xFE0F))
	async def info(self, interaction: discord.Interaction, button: discord.ui.Button):
		proc = psutil.Process(self.pid)
		embed = discord.Embed(title='Detection details', description=f'**{self.blacklist['name']}**', color=0xAAAAFF)
		cmdline = ' '.join(proc.cmdline())
		if len(cmdline) > 256:
			cmdline = cmdline[:256] + f' ...({len(cmdline)-256} more characters)'

		embed.add_field(inline=False, name='Detected process', value=f'Process: `{proc.name()}`\nPID: `{proc.pid}`\nUser: `{proc.username()}`\nCommand:\n```\n{cmdline}\n```')
		embed.add_field(inline=False, name='Blacklist entry', value=f'Name: `{self.blacklist['name']}`\nBinaries: `{', '.join(self.blacklist['binaries'])}`\n{'In arguments: `' + ', '.join(self.blacklist['args']) + '`' if 'args' in self.blacklist else ''}')
		await interaction.response.send_message(embed=embed, view=DetailsActions(blacklist))

class DetailsActions(discord.ui.View):
	def __init__(self, blacklist):
		super().__init__()
		self.blacklist = blacklist
	
	@discord.ui.button(label='View Blacklist', emoji=chr(0x1F4C4))
	async def list(self, interaction: discord.Interaction, button: discord.ui.Button):
		embed = discord.Embed(title='Blacklist', description='Blacklisted applications', color=0xAAAAFF)
		for app in self.blacklist:
			embed.add_field(inline=False, name=app['name'], value=f'Binaries: `{", ".join(app["binaries"])}`\n{"In arguments: `" + ", ".join(app["args"]) + "`" if "args" in app else ""}')
		await interaction.response.send_message(embed=embed)

def get_processes(user: str) -> list[psutil.Process]:
	processes = []
	for proc in psutil.process_iter(['pid', 'name', 'username']):
		if proc.info['username'] == user:
			processes.append(proc)

	return processes

def get_applications(user: str):
	applications = []

	for proc in get_processes(user):
		try:
			parent = proc.parent()
			if parent is not None or parent.username() != user:
				applications.append(proc)
		except psutil.Error:
			pass
	
	return applications

if __name__ == '__main__':
	client.run(os.getenv('BOT_TOKEN'))