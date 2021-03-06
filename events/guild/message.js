const pool = require("../../database.js");
module.exports = (Discord, client, message) => {
    if (message.channel.type === 'dm') {
        if (message.author.bot) return;

        const args = message.content.split(/ +/);
        const cmd = args.shift().toLowerCase();

        const command = client.dmCommands.get(cmd) || client.dmCommands.find(a => a.aliases && a.aliases.includes(cmd));
    
        if (command) command.execute(client, message, cmd, args, Discord); else {
            message.channel.send("Ich kann mit diesem Befehl leider nichts anfangen. Sende \"hilfe\" ohne anfürhungszeichen, damit du siehst, was ich verstehe.")
        };

    } else {
        pool.query("SELECT * FROM guilds WHERE id = ?", [message.guild.id], function(error, results) {
            if (error) throw error;
            let prefix = '!';
            if (results[0].prefix) {
                prefix = results[0].prefix;
            }
            if (!message.content.startsWith(prefix) || message.author.bot) return;
    
            const args = message.content.slice(prefix.length).split(/ +/);
            const cmd = args.shift().toLowerCase();
    
            const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
    
            if (command) command.execute(client, message, cmd, args, Discord);
        })
    }
}