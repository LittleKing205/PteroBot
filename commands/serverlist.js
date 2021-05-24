const Nodeactyl = require("nodeactyl-beta")
module.exports = {
    name: 'server-list',
    aliases: ["sl", "serverlist"],
    description: 'Listet alle Server des Users',
    async execute(client, message, cmd, args, Discord) {
        const guildId = message.guild.id;
        const authorId = message.author.id

        client.database.query("SELECT * FROM guilds where id = ?", [guildId], function(guildError, guildResults) {
            if (guildError) throw guildError;
            if (guildResults[0].adress != null) {
                client.database.query("SELECT * FROM users where guildId = ? AND userId = ?", [guildId, authorId], async function(userError, userResults) {
                    if (userError) throw userError;
                    if (userResults[0]) {
                        const pteroClient = new Nodeactyl.NodeactylClient(guildResults[0].adress, userResults[0].token);
                        let servers = await pteroClient.getAllServers();

                        const embedMsg = new Discord.MessageEmbed()
                        .setTitle('Deine Server')
                        .setDescription('');
                        
                        for (let i in servers.data) {
                            let server = servers.data[i].attributes;
                            let usages = await pteroClient.getServerUsages(server.identifier);
                            
                            embedMsg.addField(server.name, "Server ID: " + server.identifier + "\n"+
                                "Status: " + usages.current_state + "\n", false);
                        }
                        message.channel.send(embedMsg)
                    } else {
                        message.reply("Upps. Ich habe leider noch nicht deinen API Token und bin somit blind. Ich habe dir eine Private Nachricht geschrieben, mit weiteren anweisungen.");
                        message.author.send("Hi, Du hast versucht, ein Befehl auf dem Server \"" + message.guild.name + "\" auszuführen.\n"+
                        "Ich konnte deinen API Key für diesen Server nicht finden. Bitte logge dich bei deinem Serverpanel ein (" + guildResults[0].adress + ") und erstelle einen \"API Key\" in den Profil Einstellungen\n" +
                        "Sobald der Key erstellt ist, sende mir bitte folgende nachricht:\n\n"+
                        "token " + guildId + " <API_Key>");
                    }
                })
            } else {
                message.reply("Es tut mir leid. Dieser Server wurde noch nicht konfiguriert. Dies kann mit folgendem Befehl gemacht werden:\n " + guildResults[0].prefix + "pteroconf panel <Adress>"+
                "\n\nBitte beachte dabei, das dies nur von einem Server Administrator gemacht werden kann.")
            }
        });
    }
}