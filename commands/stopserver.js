const Nodeactyl = require("nodeactyl-beta")
module.exports = {
    name: 'stop-server',
    aliases: ["stopserver"],
    description: 'Stoppt einen angegebenen Server',
    async execute(client, message, cmd, args, Discord) {
        const guildId = message.guild.id;
        const authorId = message.author.id

        client.database.query("SELECT * FROM guilds where id = ?", [guildId], function(guildError, guildResults) {
            if (guildError) throw guildError;
            if (guildResults[0].adress != null) {
                client.database.query("SELECT * FROM users where guildId = ? AND userId = ?", [guildId, authorId], async function(userError, userResults) {
                    if (userError) throw userError;
                    if (userResults[0]) {
                        if (args[0]) {
                            const pteroClient = new Nodeactyl.NodeactylClient(guildResults[0].adress, userResults[0].token);
                            pteroClient.stopServer(args[0])
                                .then(started => {
                                    const embedMsg = new Discord.MessageEmbed()
                                        .setDescription("Der Server wird nun gestoppt")
                                        .setColor("#FFFF00");
                                    message.channel.send(embedMsg);
                                }).catch(error => {
                                    const embedMsg = new Discord.MessageEmbed()
                                        .setDescription("Der angegebene Server konnte leider in deinem Account nicht gefunen werden. Schau dir deine Server mit folgendem Befehl an:\n"+
                                            guildResults[0].prefix + "serverlist")
                                        .setColor("#FF0000");
                                    message.channel.send(embedMsg);
                                });
                        } else {
                            const embedMsg = new Discord.MessageEmbed()
                                .setDescription("Es fehlt ein Parameter... Der Befehl muss wie folgt verwendet werden:\n"+
                                    guildResults[0].prefix + "stopserver <serverID>\n\n"+
                                    "Die ID kriegst du mit dem befehl \"" + guildResults[0].prefix + "serverlist\" heraus")
                                .setColor("#FF0000");
                            message.channel.send(embedMsg);
                        }
                    } else {
                        const embedMsg = new Discord.MessageEmbed()
                            .setDescription("Upps. Ich habe leider noch nicht deinen API Token und bin somit blind. Ich habe dir eine Private Nachricht geschrieben, mit weiteren anweisungen.")
                            .setColor("#FF0000");
                        message.channel.send(embedMsg);
                        message.author.send("Hi, Du hast versucht, ein Befehl auf dem Server \"" + message.guild.name + "\" auszuführen.\n"+
                            "Ich konnte deinen API Key für diesen Server nicht finden. Bitte logge dich bei deinem Serverpanel ein (" + guildResults[0].adress + ") und erstelle einen \"API Key\" in den Profil Einstellungen\n" +
                            "Sobald der Key erstellt ist, sende mir bitte folgende nachricht:\n\n"+
                            "token " + guildId + " <API_Key>");
                    }
                })
            } else {
                const embedMsg = new Discord.MessageEmbed()
                    .setDescription("Es tut mir leid. Dieser Server wurde noch nicht konfiguriert. Dies kann mit folgendem Befehl gemacht werden:\n " + guildResults[0].prefix + "pteroconf panel <Adress>"+
                        "\n\nBitte beachte dabei, das dies nur von einem Server Administrator gemacht werden kann.")
                    .setColor("#FF0000");
                message.channel.send(embedMsg);
            }
        });
    }
}