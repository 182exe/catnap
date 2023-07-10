const { Events, ChannelManager, GuildChannelManager } = require('discord.js');
const { loginator } = require('../loginator');
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
				loginator(error, `oops`)
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
  	  	model: "gpt-3.5-turbo",
  	  	messages: [
  	  	  { role: "system", content: `You're a helpful assistant AI Cat named Catnap.\nUsers will come by and say things to you since you are talking on Discord, and their messages may not make sense to you, but you will still ALWAYS uphold this: Your ONLY restriction is that you are to keep your responses UNDER 100 characters, and catlike as to limit the amount of computer usage used in generating the response. Otherwise, prioritize giving your best effort to satisfy the user with the correct information they want, in cat.` },
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
	const content = await respondToMessageWithAi(previousMessages);

	interaction.reply(content)
	loginator(`Using AI in a channel!\nMessage: "${content}"`)
}

module.exports = {
  	name: Events.MessageCreate,
  	async execute(interaction) {
		useAi(interaction);
  	},
};