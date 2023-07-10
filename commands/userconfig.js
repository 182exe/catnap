const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userconfig')
        .setDescription('configure your settings')
        .addBooleanOption(option => option
            .setName('ephemeral')
            .setDescription('send command responses as ephemeral messages (they only get shown to you)')
            .setRequired(false)),
    async execute(interaction) {
        const user = interaction.user.id;
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

        const filePath = path.join(__dirname, '..', 'user_data.json');

        let userData = {};
        try {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            userData = JSON.parse(fileData);
        } catch (error) {}

        userData[user] = {
            tos: userData[user]?.tos ?? true,
            ephemeral: ephemeral
        };

        try {
            fs.writeFileSync(filePath, JSON.stringify(userData, null, 4));
        } catch (error) {
            loginator(error, `oops`);
        }

        const responseEmbed = new EmbedBuilder(config.embedFormat)
            .setAuthor({ name: `/${this.data.name}` })
            .addFields({
                name: 'User Configuration',
                value: `You updated some of your settings. Here's what they look like now:\n\`\`\`json\n${JSON.stringify(userData[user], null, 4)}\`\`\``
            });

        await interaction.reply({ embeds: [responseEmbed], ephemeral: userData[user]?.ephemeral ?? true });
    },
};