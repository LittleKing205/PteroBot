# PteroBot
A simple Bot to Contol your Servers at Pterodactyl Panel.

## Installation
```shell
git clone https://github.com/LittleKing205/PteroBot.git
cd PteroBot
npm install
cp config.js.sample config.js
```
after that you have to edit the config.js to your needs.
To get your Bot Token please go to [Discords Developer Page](https://discord.com/developers/)

## Bot Commands
All Commands are listed with the default prefix "!"
| Command | Aliases | Description |
| ------- | ------- | ----------- |
| !serverlist | !server-list, !sl | Displays a list that a user has access to. |
| !servercontrol \<Server ID\> | !server-control, !sc | Displays statistics about the server and lets the user control the server |
| !startserver \<Server ID\> | !start-server | Start the given Server |
| !stopserver \<Server ID\> | !stop-server | Stopps the given Server |
| !restartserver \<Server ID\> | !restart-server | Restart the given Server |
| !killserver \<Server ID\> | !kill-server | Kills the given Server |
| !pteroconf \<prefix\> \<new Prefix\> | !pc, !ptero-conf, !pteroconfig | Sets the server prefix for the bot |
| !pteroconf \<adress\> \<Panel Adress\> | !pc, !ptero-conf, !pteroconfig | Sets the panel adress for the server |

## DM Commands
All DM Commands are used without any prefix.

| Command | Description |
| ------- | ----------- |
| help | Shows a list with all DM Commands |
| token \<Server ID\> \<Api Token\> | Sets the given API Token to the Guild ID |

## TODOS
* Add multilanugage support (i18n)
* Add abtility to React on Serverlist
* Test the Bot

## Contribution
Feel free to add Push requests and feel free to open a issue if any happens.