module.exports = {
    name: 'ptero-conf',
    aliases: ["pc", "pteroconf"],
    description: 'Listet alle Server des Users',
    async execute(client, message, cmd, args, Discord) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Entschuldige, dieser Befehl ist nur Administratoren vorbehalten");

        client.database.query("SELECT * FROM guilds where id = ?", [message.guild.id], function(guildError, guildResults) {
            if (guildError) throw guildError;
            const prefix = guildResults[0].prefix
            if (args[0] && args[1]) {
                if (args[0] == "prefix") {
                    if (args[1].length == 1) {
                        client.database.query("UPDATE guilds SET prefix = ? WHERE id = ?", [args[1], message.guild.id], function(error, results) {
                            if (error) throw error;
                            const embedMsg = new Discord.MessageEmbed()
                                .setDescription("Der Prefix für diesen Server wurde erfolgreich geändert.")
                                .setColor("#00FF00");
                            message.channel.send(embedMsg);
                        });
                    } else {
                        const embedMsg = new Discord.MessageEmbed()
                            .setDescription("Der Prefix sollte nur ein Zeichen lang sein.")
                            .setColor("#FF0000");
                        message.channel.send(embedMsg);
                    }
                } else if (args[0] == "adress") {
                    if ((args[1].startsWith("http://") || args[1].startsWith("https://")) && args[1].endsWith("/")) {
                        client.database.query("UPDATE guilds SET adress = ? WHERE id = ?", [args[1], message.guild.id], function(error, results) {
                            if (error) throw error;
                            const embedMsg = new Discord.MessageEmbed()
                                .setDescription("Die Adresse wurde erfolgreich auf " + args[1] + " abgeändert. Bitte kontrolliere dies nochmal, dass die Startseite aufgerufen wird. Sonst können die Server nicht richtig gefunden werden")
                                .setColor("#00FF00");
                            message.channel.send(embedMsg);
                        });
                    } else {
                        const embedMsg = new Discord.MessageEmbed()
                            .setDescription("Die Adresse des Panels sollte mit \"http\" oder \"https\" beginnen und mit \"/\" enden")
                            .setColor("#FF0000");
                        message.channel.send(embedMsg);
                    }
                } else {
                    sendArgsError(Discord, message.channel, prefix);
                }
            } else {
                sendArgsError(Discord, message.channel, prefix);
            }
        });
    }
}

function sendArgsError(Discord, channel, prefix) {
    const embedMsg = new Discord.MessageEmbed()
        .setDescription("Da ist etwas schiefgelaufen. Es müssen 2 Parameter angegeben werden.\n"+
        "Hier ein Paar Beispiele: \n\n"+
        prefix + "pteroconf prefix <neuer Prefix>\n"+
        prefix + "pteroconf adress <Panel Adresse>")
        .setColor("#FF0000");
    channel.send(embedMsg);
}