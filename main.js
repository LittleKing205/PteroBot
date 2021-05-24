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

const dbConn = mysql.createConnection({
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	database : config.database.database
})

dbConn.connect(function(err) {
	if (err) {
	  console.error('error connecting: ' + err.stack);
	  return;
	}
	console.log("Databank verbindung hergestellt.");
	client.database = dbConn;
	client.login(config.bot.token);
});
// Link: https://discord.com/api/oauth2/authorize?client_id=846336379674951701&permissions=2147502080&scope=bot