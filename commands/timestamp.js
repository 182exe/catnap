const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const localCommands = require(`../commands_generated.json`)
const config = require('../config.json');
const userData = require(`../user_data.json`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timestamp')
		.setDescription('Send the current time in the form of 7 different Discord timestamps.'),
	async execute(interaction) {
        const t = Math.floor(Date.now() / 1000);
		const responseEmbed = new EmbedBuilder(config.embedFormat).setTimestamp().setAuthor({name: `/${this.data.name}`}).addFields(
			{
				name: `Discord Timestamps`,
				value: `Discord implemented a timestamp feature that allows you to do some cool stuff. Here's all of them!
				- \`<t:${t}:f>\` \`➡\` <t:${t}:f>\n- \`<t:${t}:F>\` \`➡\` <t:${t}:F>\n- \`<t:${t}:d>\` \`➡\` <t:${t}:d>\n- \`<t:${t}:D>\` \`➡\` <t:${t}:D>\n- \`<t:${t}:T>\` \`➡\` <t:${t}:t>\n- \`<t:${t}:T>\` \`➡\` <t:${t}:f>\n- \`<t:${t}:R>\` \`➡\` <t:${t}:R>`
			}
		)

		await interaction.reply({ embeds: [responseEmbed], ephemeral: userData[user]?.ephemeral ?? true });
	},
};