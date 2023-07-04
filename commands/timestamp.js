const { SlashCommandBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timestamp')
		.setDescription('Send the current time in the form of 7 different Discord timestamps.'),
	async execute(interaction) {
        const t = Math.floor(Date.now() / 1000);
        const content = `Here's the current time converted into timestamps.\n> \`<t:${t}:f>\` \`➡\` <t:${t}:f>\n> \`<t:${t}:F>\` \`➡\` <t:${t}:F>\n> \`<t:${t}:d>\` \`➡\` <t:${t}:d>\n> \`<t:${t}:D>\` \`➡\` <t:${t}:D>\n> \`<t:${t}:T>\` \`➡\` <t:${t}:t>\n> \`<t:${t}:T>\` \`➡\` <t:${t}:f>\n> \`<t:${t}:R>\` \`➡\` <t:${t}:R>`;
		await interaction.reply(content);
	},
};