const pool = require("../database.js");
const { NodeactylClient } = require("nodeactyl-beta");
const Nodeactyl = require("nodeactyl-beta")
module.exports = {
    name: 'server-control',
    aliases: ["sc", "servercontrol"],
    description: 'Listet alle Server des Users',
    async execute(client, message, cmd, args, Discord) {
        const guildId = message.guild.id;
        const authorId = message.author.id

        pool.query("SELECT * FROM guilds where id = ?", [guildId], function(guildError, guildResults) {
            if (guildError) throw guildError;
            if (guildResults[0].adress != null) {
                pool.query("SELECT * FROM users where guildId = ? AND userId = ?", [guildId, authorId], async function(userError, userResults) {
                    if (userError) throw userError;
                    if (userResults[0]) {
                        if (args[0]) {
                            const pteroClient = new NodeactylClient(guildResults[0].adress, userResults[0].token);
                            pteroClient.getServerUsages(args[0]).then(async (usages) => {
                                let server = await pteroClient.getServerDetails(args[0]);
                                const embedMsg = new Discord.MessageEmbed()
                                    .setTitle(server.name)
                                    .addFields(
                                        {name: "RAM", value: niceBytes(usages.resources.memory_bytes) + " / " + niceBytes(server.limits.memory, 2), inline: true},
                                        {name: "CPU", value: usages.resources.cpu_absolute + "%", inline: true},
                                        {name: "Speicher", value: niceBytes(usages.resources.disk_bytes) + " / " + niceBytes(server.limits.disk, 2), inline: true},
                                        {name: "\u200B", value: "\u200B"},
                                        {name: "Aktueller Status", value: usages.current_state},
                                        {name: "\u200B", value: "\u200B"},
                                        {name: "Aktionen:", value: "▶  Server Starten\n"+
                                                "⏹  Server Herunterfahren\n"+
                                                "🔄  Server neustarten\n"+
                                                "❌  Server Killen (Nur empfohlen, wenn der Server nicht normal herunterfährt)"}
                                    );
                                    let isRunning = true;
                                    switch (usages.current_state) {
                                        case "running":
                                            embedMsg.setColor("#00FF00");
                                            break;
                                        case "starting":
                                            embedMsg.setColor("#FFFF00");
                                            break;
                                        case "stopping":
                                            embedMsg.setColor("#FFA500");
                                            break;
                                        default:
                                            embedMsg.setColor("#FF0000");
                                            isRunning = false;
                                            break;
                                    }
                                    message.channel.send(embedMsg).then(async (msg) => {
                                        if (isRunning) {
                                            if (usages.current_state == "running")
                                                await msg.react("🔄");
                                            await msg.react("⏹");
                                            await msg.react("❌");
                                        } else {
                                            await msg.react("▶");
                                        }

                                        const filter = (reaction, user) => {
                                            return ["▶", "⏹", "🔄", "❌"].includes(reaction.emoji.name) && user.id === authorId;
                                        }

                                        msg.awaitReactions(filter, {max: 1, time: 20000, errors: ['time']})
                                            .then(collected => {
                                                const reaction = collected.first();
                                                const newMsg = new Discord.MessageEmbed()
                                                    .setTitle(server.name)
                                                    .setColor("#FFFF00");

                                                switch (reaction.emoji.name) {
                                                    case "▶":
                                                        newMsg.setDescription("Der Server wird nun gestartet. Bitte warten...");
                                                        pteroClient.startServer(args[0]);
                                                        break;
                                                    case "⏹":
                                                        newMsg.setDescription("Der Server wird nun gestoppt. Bitte warten...");
                                                        pteroClient.stopServer(args[0])
                                                        break;
                                                    case "🔄":
                                                        newMsg.setDescription("Der Server wird nun neugestartet. Bitte warten...");
                                                        pteroClient.restartServer(args[0]);
                                                        break;
                                                    case "❌":
                                                        newMsg.setDescription("Der Server wird nun gekillt. Bitte warte...");
                                                        newMsg.setColor("#FFFF00");
                                                        pteroClient.killServer(args[0]);
                                                }
                                                msg.edit(newMsg);
                                                msg.reactions.removeAll();
                                            })
                                            .catch(async (collected) => {
                                                await msg.reactions.removeAll().catch(error => {
                                                    console.log("Keine Berechtigung Reactions zu entfernen")
                                                });
                                            })
                                    });
                            }).catch(error => {
                                const embedMsg = new Discord.MessageEmbed()
                                    .setDescription("Es wurde leider kein Server mit der angegeben ID gefunden. Lass dir sonst eine Liste deiner Server anzeigen mit:\n"+
                                        guildResults[0].prefix + "sl")
                                    .setColor("#FF0000");
                                message.channel.send(embedMsg);
                            });
                        } else {
                            const embedMsg = new Discord.MessageEmbed()
                                .setDescription("Es wurde leier kein server gewählt. Bitte gib den Befehl mit folgendem Aufbau nochmal ein:\n"+
                                    guildResults[0].prefix + "sc <Server ID>\n\n"+
                                        "Falls du die ID deines Servers nicht kennst, kannst du dies mit folgendem Befehl abfragen:\n"+
                                    guildResults[0].prefix + "sl")
                                .setColor("#FF0000");
                            message.channel.send(embedMsg);
                            return;
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

function niceBytes(x, start = 0){
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = start, n = parseInt(x, 10) || 0;
    while(n >= 1024 && ++l){
        n = n/1024;
    }
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}