const fs = require('fs');

module.exports = (client, Discord) => {
    const command_files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

     for (const file of command_files) {
        const command = require(`../commands/${file}`);
        if (command.name) {
            console.log("Register Command: " + command.name);
            client.commands.set(command.name, command);
        } else {
            continue;
        }
    }
    
    const dmCommand_files = fs.readdirSync('./dmCommands').filter(file => file.endsWith('.js'));

     for (const file of dmCommand_files) {
        const command = require(`../dmCommands/${file}`);
        if (command.name) {
            console.log("Register DM Command: " + command.name);
            client.dmCommands.set(command.name, command);
        } else {
            continue;
        }
    }
}