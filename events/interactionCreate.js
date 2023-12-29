const { Events, Client } = require('discord.js');
const Loginator = require(`../loginator.js`)
const logger = new Loginator(4, false, {
    "info": {fg: "brightblack", bg: "white"},
    "chat": {fg: "white", bg: "brightblack"},
    "warn": {fg: "brightwhite", bg: "yellow"},
    "uhoh": {fg: "yellow", bg: "red"},
});
logger.init();
const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const userId = interaction.user.id;
		const userDataPath = path.join(__dirname, '..', 'user_data.json');
		const userData = JSON.parse(fs.readFileSync(userDataPath));

		if ((!userData[userId] || !userData[userId].tos) && (interaction.commandName !== 'tos' && interaction.commandName !== 'settos')) {
			await interaction.reply({
				embeds: [
					new EmbedBuilder(config.embedFormat).setTimestamp().setAuthor({name: `oops...`}).addFields({
						name: `Terms of Service / Privacy Statement`,
						value: `Please use \` /tos \` before using this bot.`
					})
				],
				ephemeral: true
			});
		} else {
			const command = interaction.client.commands.get(interaction.commandName);
			logger.info(`/${interaction.commandName} is running...\nfrom: ${interaction.user.tag} (${interaction.user.id})`);
			
			if (!command) {
				logger.oops(`Someone ran a command that didn't exist! ${interaction.commandName} is not existing. Try redeploying commands.`);
				return;
			}
			try {
				await command.execute(interaction);
			} catch (error) {
				logger.oops(`Something went wrong when trying to run a command! Error text: ${error}`);
			}
		};
		return;
	},
};