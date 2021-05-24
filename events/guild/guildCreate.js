module.exports = (Discord, client, guild) => {
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
        if(channel.type == "text" && defaultChannel == "") {
            if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
            defaultChannel = channel;
            }
        }
    });
    defaultChannel.send(`Hallo hier ist PteroBot. Mit mir können deine User schnell und einfach Ihre Server steuern. Anbei sende ich noch eine liste mit meinen Befehlen.`, {
    embed:{
        title: 'Befehlsliste',
        color: 0x2471a3, 
        description: "Der Standart prefix für all meine Befehle ist \'!\' dies kann natürlich auch geändert werden.",
        fields:[ 
            {
                name: 'serverlist',
                value: 'Zeigt eine Liste aller Server an, die dem User zugewiesen sind'
            },
            {
                name: 'servercontrol',
                value: 'Zeigt eine simple oberfläche vom Server an. Inklusive ein paar Statistiken. Zudem kann der Server mit Reactions gestartet oder gestoppt weren'
            },
            {
                name: 'startserver <serverId>',
                value: 'Startet einen bestimmten Server'
            },
            {
                name: 'stopserver <serverId>',
                value: 'Stoppt einen bestimmten Server'
            },
            {
                name: 'restartserver <serverId>',
                value: 'Startet einen bestimmten Server neu'
            },
            {
                name: 'killserver <serverId>',
                value: 'Killt den Serverprozess'
            },
            {
                name: 'pteroconf prefix <Prefix>',
                value: 'Setzt das gewünschte prefix für diesen Server (Nur für Administratoren)'
            },    
            {
                name: 'pteroconf panel <Adress>',
                value: 'Setzt die Paneladresse, worauf die API zugreifen soll. (Nur für Administratoren)'
            }
        ],
        footer: {
            text: 'PteroBot was developed by LittleKing205#7824.'
        }
    }});
    client.database.query('SELECT * FROM `guilds` WHERE `id` = ?', [guild.id], function (error, results, fields) {
        if (results.length == 0) {
            client.database.query('INSERT INTO guilds SET ?', {id: guild.id, name: guild.name}, function (error, results) {
                if (error) throw error;
                console.log('Logged in into new Server: ' + guild.name + ' with ID: ' + guild.id);
            })
        }
    });
    client.user.setActivity(`auf ${client.guilds.cache.size} Servern`, { type : 'PLAYING'}).then(r => console.log("Updating Playing Message"));
}