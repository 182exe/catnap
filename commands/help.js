const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const fs = require('fs');
const localCommands = require(`../commands_generated.json`)
const config = require('../config.json');
//.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides you with a guide on how to use Catnap.'),
	async execute(interaction) {
		const responseEmbed = new EmbedBuilder(config.embedFormat).setTimestamp()
		localCommands.forEach(command => {
			catnapHelp.addFields({
			  	name: command.name,
			  	value: command.value,
			  	inline: true
			});
		});
		await interaction.reply({ embeds: [responseEmbed] });
	},
};