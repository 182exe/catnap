const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const fs = require(`node:fs`)
const path = require(`node:path`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tos')
		.setDescription('View the bot terms of service.'),
	async execute(interaction) {
		let userData = {};
        try {
            const fileData = fs.readFileSync(path.join(__dirname, '..', 'user_data.json'), 'utf-8');
            userData = JSON.parse(fileData);
        } catch (error) {}
		
		const responseEmbed = new EmbedBuilder(config.embedFormat).setTimestamp().setAuthor({name: `/${this.data.name}`}).addFields({
			name: `Terms of Service / Privacy Statement`,
			value: `If you have your direct messages open, then you should have recieved a DM from Catnap explaining the TOS. If not, please enable server members to DM you and re-run this command. Then, you can disable them if you wish.`
		})
		
		const tosFields = Object.entries(config.tos).map(([name, value]) => ({
            name,
            value,
        }));

		const dmEmbed = new EmbedBuilder(config.embedFormat).setTimestamp().addFields(...tosFields);

		await interaction.reply({ embeds: [responseEmbed], ephemeral: userData[interaction.user.id]?.ephemeral ?? true });
		
		interaction.user.send({ embeds: [dmEmbed] })
	},
};