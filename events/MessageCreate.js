const { Events, ChannelManager, GuildChannelManager } = require('discord.js');
const Loginator = require(`../loginator.js`)
const logger = new Loginator(4, false, {
    "info": {fg: "brightblack", bg: "white"},
    "chat": {fg: "white", bg: "brightblack"},
    "warn": {fg: "brightwhite", bg: "yellow"},
    "uhoh": {fg: "yellow", bg: "red"},
});
logger.init();
const fs = require('node:fs');
const path = require('node:path');
const config = require('../config.json');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration(config.openai);
const openai = new OpenAIApi(configuration);

async function getPreviousMessages(interaction, userId, botId, guildData) {
	const channelId = guildData[interaction.guild.id]?.aichannel;
	if (!channelId) {
		return [];
	}

	const channel = await interaction.client.channels.fetch(channelId);
	if (!channel) {
		return [];
	}

	const messageHistory = await channel.messages.fetch({ limit: 100 });
	const previousMessages = messageHistory.filter((msg) => msg.author.id === userId || msg.author.id === botId);
	const previousConversationMessages = await Promise.all(previousMessages.map(async (msg) => {
		if (msg.author.id === botId && msg.reference !== null) {
			referencedMessage = {};
			try {
				referencedMessage = await channel.messages.fetch(msg.reference.messageId);
			} catch (error) {
				logger.oops(error)
			}
			if (referencedMessage.author.id === userId) {
				return {
					role: "assistant",
					content: msg.content,
				};
			}
		} else if (msg.author.id === userId) {
			return {
				role: "user",
				content: msg.content,
			};
		}
		return null;
	}));

	return previousConversationMessages.filter(Boolean).reverse();
}

async function respondToMessageWithAi(previousMessages) {
  	let aiInput = {
  	  	model: "gpt-4",
  	  	messages: [
  	  	  { role: "system", content: config.openai.systemContext },
  	  	  ...previousMessages
  	  	],
  	  	temperature: 1,
  	  	max_tokens: 50,
  	};

  	try {
  	  	var completion = await openai.createChatCompletion(aiInput);
  	} catch (error) {
  	  	// Handle error
  	  	return undefined;
  	}

  	if (!completion) {
  	  	return undefined;
  	} else {
  	  	return completion.data.choices[0].message.content;
  	}
}

function clearDiscordPings(inputString) {
	const mentionRegex = /(@everyone|@here|<@&?\d+>)/g;
	
	const cleanString = inputString.replace(mentionRegex, '');
  
	return cleanString;
}

async function useAi(interaction) {
	const guildData = require('../guild_data.json');
	const userId = interaction.author.id;
	const botId = interaction.client.user.id;
	if (interaction.guild !== null) {
		if (interaction.channel.id !== guildData[interaction.guild.id].aichannel) {
			return
		};
	}
	const userDataPath = path.join(__dirname, '..', 'user_data.json');
	const userData = JSON.parse(fs.readFileSync(userDataPath));
	if (!userData[userId] || !userData[userId].tos) { return };

	const previousMessages = await getPreviousMessages(interaction, userId, botId, guildData)
	let content = await respondToMessageWithAi(previousMessages);
	content = clearDiscordPings(content);

	interaction.reply(content)
	logger.info(`Using AI in a channel!\nMessage: "${content}"`)
}

module.exports = {
  	name: Events.MessageCreate,
  	async execute(interaction) {
		useAi(interaction);
  	},
};