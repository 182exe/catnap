const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = require('../config.json');

//.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settos')
		.setDescription('Accept TOS to use Catnap.')
        .addBooleanOption(option => option
            .setName(`agreement`)
            .setDescription(`set or modify your TOS agreement`)
            .setRequired(true)),
	async execute(interaction) {
        let userData = {};
        try {
            const fileData = fs.readFileSync(path.join(__dirname, '..', 'user_data.json'), 'utf-8');
            userData = JSON.parse(fileData);
        } catch (error) {}
        const responseMsg = interaction.options.getBoolean(`agreement`) ? 'accepted the terms of service! Coolio!' : 'disagreed!? Well, shame on you! (you can re-try at any time if you want, though :>)';
		const responseEmbed = new EmbedBuilder(config.embedFormat).setAuthor({name: `/${this.data.name}`}).addFields({
            name: `TOS Agreement`,
            value: `You have ${responseMsg}`
        })
        const user = interaction.user.id;
        const filePath = path.join(__dirname, '..', 'user_data.json');

        let jsonData = {};
        try {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            jsonData = JSON.parse(fileData);
        } catch (error) {}

        if (jsonData[user]) {
            jsonData[user].tos = interaction.options.getBoolean(`agreement`)
        } else {
            jsonData[user] = {
                tos: interaction.options.getBoolean(`agreement`)
            }
        }

        try {
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4));
        } catch (error) {}
        
		await interaction.reply({ embeds: [responseEmbed], ephemeral: userData[interaction.user.id]?.ephemeral ?? true });
	},
};