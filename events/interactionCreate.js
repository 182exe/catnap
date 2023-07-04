const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		console.log(`Run | Interaction "${interaction.commandName}" recieved | id: ${interaction.user.id} username: ${interaction.user.tag}`);
		if (!command) {
			console.error(`Error | No command matching ${interaction.commandName} was found.`);
			return;
		}
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error | A problem occured while attempting to execute ${interaction.commandName}`);
			console.error(error);
		}
		return;
	},
};