const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const config = require('../config.json');

const gifs = [
	"https://thumbs.gfycat.com/EssentialHollowGalapagossealion-size_restricted.gif",
	"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/29d5a409-03ba-48bf-b139-6c2cfc098892/d5aev55-f872a3f7-39a3-4cd2-aeb0-5d7431130203.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI5ZDVhNDA5LTAzYmEtNDhiZi1iMTM5LTZjMmNmYzA5ODg5MlwvZDVhZXY1NS1mODcyYTNmNy0zOWEzLTRjZDItYWViMC01ZDc0MzExMzAyMDMuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Jzn8ej4Cf78ausLH6ooIqfJeOFhV_0C1A9DlWonElIc",
	"https://img.buzzfeed.com/buzzfeed-static/static/2015-03/19/16/enhanced/webdr10/anigif_enhanced-18536-1426798539-17.gif",
	"https://thumbs.gfycat.com/RashShrillBluegill-max-1mb.gif",
	"https://i.gifer.com/SQPj.gif",
	"https://thumbs.gfycat.com/ImpressiveHatefulBluebottle-size_restricted.gif",
	"https://www.netanimations.net/Moving-animated-picture-of-Geico-gecko-playing-ping-pong.gif",
	"https://i.gifer.com/QVVi.gif",
	"https://64.media.tumblr.com/9c684a519126807ec48e922d10623557/tumblr_nsdobkRgG01ua8mwuo1_500.gif",
	"https://media.tenor.com/uQibhN4CbbUAAAAM/ping-pong-ping-pong-dance.gif",
	"https://i.imgur.com/Y1SiR.gif",
	"https://i.gifer.com/815L.gif"
];
const gif = gifs[Math.floor(Math.random() * gifs.length)]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies if the bot is online.'),
	async execute(interaction) {
		const responseEmbed = new EmbedBuilder(config.embedFormat).setAuthor({name: `/${this.data.name}`}).setImage(gif)
		await interaction.reply({ embeds: [responseEmbed] });
	},
};