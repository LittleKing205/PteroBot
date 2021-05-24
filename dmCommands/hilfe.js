module.exports = {
    name: 'hilfe',
    description: 'Zeigt eine Liste an, die per DM geschickt werden kann.',
    async execute (client, message, cmd, args, Discord) {
        message.channel.send("", {
            embed:{
                title: 'Befehlsliste',
                color: 0x2471a3, 
                description: "",
                fields:[ 
                    {
                        name: 'token <ServerID> <token>',
                        value: 'Setzt den API token, für den'
                    }, 
                    {
                        name: 'hilfe',
                        value: 'Zeigt diese Seite an.'
                    }
                ]
            }});
    }
}