const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const localCommands = require(`../commands_generated.json`)
const config = require('../config.json');
const userData = require(`../user_data.json`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tos')
		.setDescription('View the bot terms of service.'),
	async execute(interaction) {
		const responseEmbed = new EmbedBuilder(config.embedFormat).setTimestamp().setAuthor({name: `/${this.data.name}`}).addFields({
			name: `Terms of Service / Privacy Statement`,
			value: `If you have your direct messages open, then you should have recieved a DM from Catnap explaining the TOS. If not, please enable server members to DM you and re-run this command. Then, you can disable them if you wish.`
		})
		const dmEmbed = new EmbedBuilder(config.embedFormat).setTimestamp().setAuthor({name: `/${this.data.name}`}).addFields(
			{
				name: `Terms of Service / Privacy Statement`,
				value: `When using this bot, you agree to follow these terms and any mentioned 3rd party terms. When I refer to 'your data' I mean things that are explained at the end in the corresponding section.
TOS was last updated on <t:1688951921:D>.`
			},
			{
				name: `Catnap Rules`,
				value: `1. You will not abuse the bot's features to allow for malicious behavior that harms any community the bot is in.
2. You agree to let the bot store any data you choose to give it with the understanding that it will not be publicized intentionally without your express permission at any time (this includes things like personal settings usage stats, see below for more info).
3. You will be nice to the bot and others who interact with it.
4. You understand that you will be subject to punishment if you break the terms.`
			},
			{
				name: `Your Data`,
				value: `Your data means these things:
- Publicly accessable information through Discord APIs and profile viewing
- Data you send to the bot (any application or "slash" (/) command input may be recorded and saved unless otherwise noted) including chat messages for the AI will be saved.
				
Your data is safe within Catnap and is not linked directly to you or your presence on Discord when sent to third parties. However, Catnap relies on some third parties to function.
- OpenAI - Your data that you provide the bot with in relation to AI features is sent to OpenAI for processing. Their policies can be found at https://openai.com/policies. If you choose, I encourage you to read their terms of service and privacy statement before using AI features of any kind, not just on this bot.
				
If another third party is given access to your data within the bot, this section will be updated and you will have to re-agree to the updated terms upon attempting to use the bot.`
			},
			{
				name: `Agreement`,
				value: `Please read over some or all of these before continuing to use the bot.
When you are done, use \` /settos \` to agree.`
			}
		)
		await interaction.reply({ embeds: [responseEmbed], ephemeral: userData[user]?.ephemeral ?? true });
		
		interaction.user.send({ embeds: [dmEmbed] })
	},
};