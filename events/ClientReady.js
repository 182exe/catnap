const { Events } = require('discord.js');
const { loginator } = require('../loginator');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		loginator(`Bot logged in successfully!\nRunning as ${client.user.tag} (${client.user.id})`, `info`);
	},
};