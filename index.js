const fs = require('node:fs');
const axios = require('axios');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config.json');
const { loginator } = require('./loginator.js');

async function checkLatestVersion() {
	try {
	  	const response = await axios.get('https://github.com/182exe/catnap/releases/latest', {
			maxRedirects: 0,
			validateStatus: status => status >= 200 && status < 400,
	  	});

	  	const redirectUrl = response.headers.location;
	  	const regex = /\/tag\/(\d+\.\d+\.\d+)/;
	  	const [, latestVersion] = redirectUrl.match(regex);
	  
	  	const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
	  	const currentVersion = packageJson.version;
	  
	  	if (latestVersion !== currentVersion) {
				return true;
	  	}
	} catch (error) {
	  console.error('Error occurred while checking for the latest version:', error.message);
	}
  
	return false;
}
  
checkLatestVersion()
	.then(result => {
	  	console.log('Versions are different:', result);
	})
	.catch(error => {
	  	console.error('An error occurred:', error);
	});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		loginator(`Problem while loading in command. The command at ${filePath} is missing a required data property or execute function.`)
	}
}

client.login(config.token);