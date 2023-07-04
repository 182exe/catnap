const { SlashCommandBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Say something in a channel.')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('What to say.')
				.setMaxLength(50)
				.setRequired(true)),
	async execute(interaction) {
		const content = interaction.options.getString('message')
			.replace(/\W+/g, ' ');
		await interaction.reply(content);
	},
};