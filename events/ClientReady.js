const { Events } = require('discord.js');
const Loginator = require(`../loginator.js`)
const logger = new Loginator(4, false, {
    "info": {fg: "brightblack", bg: "white"},
    "chat": {fg: "white", bg: "brightblack"},
    "warn": {fg: "brightwhite", bg: "yellow"},
    "uhoh": {fg: "yellow", bg: "red"},
});
logger.init();

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		logger.info(`Bot logged in successfully!\nRunning as ${client.user.tag} (${client.user.id})`, `info`);
	},
};