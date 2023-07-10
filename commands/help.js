const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const localCommands = require(`../commands_generated.json`)
const config = require('../config.json');
const fs = require(`node:fs`)
const path = require(`node:path`)

//.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides you with a guide on how to use Catnap.'),
	async execute(interaction) {
		let userData = {};
        try {
            const fileData = fs.readFileSync(path.join(__dirname, '..', 'user_data.json'), 'utf-8');
            userData = JSON.parse(fileData);
        } catch (error) {
			console.error(error)
		}
		const responseEmbed = new EmbedBuilder(config.embedFormat).setAuthor({name: `/${this.data.name}`})
		Object.values(localCommands).forEach(command => {
			responseEmbed.addFields({
			  	name: `\` /${command.name} \``,
			  	value: `- ${command.value}`,
			  	inline: true
			});
		});
		await interaction.reply({ embeds: [responseEmbed], ephemeral: userData[interaction.user.id]?.ephemeral ?? true });
	},
};