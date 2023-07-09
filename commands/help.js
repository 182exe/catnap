const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const localCommands = require(`../commands_generated.json`)
const config = require('../config.json');
//.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides you with a guide on how to use Catnap.'),
	async execute(interaction) {
		const responseEmbed = new EmbedBuilder(config.embedFormat).setAuthor({name: `/${this.data.name}`})
		Object.values(localCommands).forEach(command => {
			responseEmbed.addFields({
			  	name: `\` /${command.name} \``,
			  	value: `- ${command.value}`,
			  	inline: true
			});
		});
		await interaction.reply({ embeds: [responseEmbed] });
	},
};