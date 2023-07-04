const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('randomserverprefix')
		.setDescription('start or stop random server prefixes displaying')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addBooleanOption(option =>
			option.setName('status')
				.setDescription('enable or disable the feature'))
		.addStringOption(option =>
			option.setName('type')
				.setDescription('how to choose the prefixes')
				.addChoices(
					{ name: 'Rotate', value: 'rotate' },
					{ name: 'Random', value: 'random' },
				))
		.addStringOption(option =>
			option.setName('prefixes')
				.setDescription('what prefixes to use (space separated)'))
		.addStringOption(option =>
			option.setName('basename')
				.setDescription('the base server name after the prefixes'))
		.addIntegerOption(option => 
			option.setName('interval')
				.setDescription('changing interval in ms')),
	async execute(interaction) {
		const baseGuildName = interaction.options.getString('basename') ?? interaction.guild.name;
		const status = interaction.options.getBoolean('status') ?? true;
		const delay = interaction.options.getInteger('interval') ?? `60000`;
		const type = interaction.options.getString('type') ?? `random`;
		const rawPrefixes = interaction.options.getString('prefixes') ?? 'l o';
		prefixes = rawPrefixes.split(' ');
		var nIntervId;
		let emojiRotateIndex = 0;
		function start() {
			isRandoming = true;
			if (!nIntervId) {
			 	nIntervId = setInterval(setEmoji, delay);
			}
		}
		function setEmoji() {
			if (isRandoming === false) { return; };
			const chosenEmoji = (type === 'random') ? prefixes[Math.floor(Math.random() * prefixes.length)] : prefixes[emojiRotateIndex];
			if (type === 'rotate') {
				emojiRotateIndex++
				if (emojiRotateIndex > prefixes.length - 1) { emojiRotateIndex = 0; };
			};
			interaction.guild.setName(`${chosenEmoji} ${baseGuildName}`);
			console.log(`Renaming server to "${chosenEmoji} ${baseGuildName}"`);
		};
		function stop() {
			isRandoming = false;
			clearInterval(nIntervId);
			nIntervId = undefined;
		}

		await interaction.reply(`Random server emoji prefix set to \`${status}\`. with a delay of \`${delay}\``);
		if (status === true && isRandoming === false) {
			start();
		} else {
			stop();
			return;
		}
	},
};