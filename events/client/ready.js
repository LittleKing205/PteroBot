module.exports = (Discord, client) => {
    console.log('Bot is now Online');
    console.log(`Bot Logged in into ${client.guilds.cache.size} Server(s)`);
    client.user.setUsername("PteroBot")
    client.user.setActivity(`auf ${client.guilds.cache.size} Servern`, { type : 'PLAYING'}).then(r => console.log("Sending Playing Message"));
}