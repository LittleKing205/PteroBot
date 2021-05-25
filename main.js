const Discord = require('discord.js');
const mysql = require('mysql')
const client = new Discord.Client();
const config = require("./config.js");

client.commands = new Discord.Collection();
client.dmCommands = new Discord.Collection();
client.events = new Discord.Collection();

['event_handler', 'command_handler'].forEach(handler => {
	require(`./handler/${handler}`)(client, Discord);
});

client.login(config.bot.token);
// Link: https://discord.com/api/oauth2/authorize?client_id=846336379674951701&permissions=2147502080&scope=bot