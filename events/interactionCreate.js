const { Events } = require('discord.js');
const { loginator } = require('../loginator');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		loginator(`/${interaction.commandName} is running...\nfrom: ${interaction.user.tag} (${interaction.user.id})`, `cmdr`);
		if (!command) {
			loginator(`Someone ran a command that didn't exist! ${interaction.commandName} is not existing. Try redeploying commands.`, `oops`);
			return;
		}
		try {
			await command.execute(interaction);
		} catch (error) {
			loginator(`Something went wrong when trying to run a command! Error text: ${error}`, `oops`);
		}
		return;
	},
};