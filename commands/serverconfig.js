const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const guildData = require(`../guild_data.json`)
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverconfig')
		.setDescription('configure the bot\'s server settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => option
            .setName(`ai_channel`)
            .setDescription(`provide a channel for the AI to live in`)
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)),
	async execute(interaction) {
        let userData = {};
        try {
            const fileData = fs.readFileSync(path.join(__dirname, '..', 'user_data.json'), 'utf-8');
            userData = JSON.parse(fileData);
        } catch (error) {}
		const responseEmbed = new EmbedBuilder(config.embedFormat).setAuthor({name: `/${this.data.name}`}).addFields({
            name: `Server Configuration`,
            value: `You updated some server settings. Here's what your server looks like now:
\`\`\`json
${JSON.stringify(guildData[interaction.guild.id], null, 4)}
\`\`\``
        })
        const guild = interaction.guild.id;
        const aiChannel = interaction.options.getChannel(`ai_channel`).id
        const filePath = path.join(__dirname, '..', 'guild_data.json');

        let jsonData = {};
        try {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            jsonData = JSON.parse(fileData);
        } catch (error) {}

        jsonData[guild] = {
            aichannel: aiChannel
        };

        try {
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4));
        } catch (error) {}
        
		await interaction.reply({ embeds: [responseEmbed], ephemeral: userData[interaction.user.id]?.ephemeral ?? true });
	},
};