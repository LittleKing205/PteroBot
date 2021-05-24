const Nodeactyl = require("nodeactyl-beta");

module.exports = {
    name: 'token',
    description: 'setzt den User Token',
    async execute (client, message, cmd, args, Discord) {
        const authorId = message.author.id;
        
        if (args.length == 2) {
            if (args[1] == "<API_Key>") {
                message.channel.send("😂 Ich habe mich wohl falsch ausgedrückt. Bitte ersetze <API_Key> mit dem Key, den du gerade generiert hast.");
                return;
            }
            client.database.query("SELECT * FROM guilds WHERE id = ?", [args[0]], function(error, results) {
                if (error) throw error;
                if (results.length == 0) {
                    message.channel.send("Entschulde, ich konnte den Server mit der ID \"" + args[0] + "\" leider nicht finden. Bitte überprüfe dies nochmal.");
                    return;
                }
                if (results[0].adress == null) {
                    message.channel.send("Bitte wende dich an den Serveradministrator. Ich wurde leider noch nicht auf diesem Server konfiguriert.");
                    return;
                }

                const pteroClient = new Nodeactyl.NodeactylClient(results[0].adress, args[1]);
                pteroClient.getAccountDetails().then(res => {
                    client.database.query('INSERT INTO users SET ?', {guildId: args[0], userId: authorId, token: args[1]}, function (error) {
                        if (error) throw error;
                        message.channel.send("Wunderbar. Der Key wurde nun in deinem Account gespeichert. Du kannst nun deine Server steuern.");
                    })
                }).catch(err => {
                    message.channel.send("Irgendwas scheint an dem Key nicht stimmen, da ich mich nicht einloggen konnte. Bitte kontrolliere den Key oder erstelle einen neuen.");
                });
            });

        } else {
            message.channel.send("Tut mir leid, die Syntax ist leider falsch. Bitte nutze folgenden Aufbau:\n"+
            "token <ServerID> <API_Key>\n"+
            "Ich sollte dir die ServerID schonmal geschickt haben.");
        }
    }
}