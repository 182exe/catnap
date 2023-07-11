const fs = require('node:fs');
const axios = require('axios');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config.json');
const { loginator } = require('./loginator.js');

async function checkLatestVersion() {
	try {
		const response = await axios.get('https://api.github.com/repos/182exe/catnap/releases/latest');
		const latestVersion = response.data.tag_name;
	  
	  	const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
	  	const currentVersion = packageJson.version;
	  
	  	return [latestVersion !== currentVersion, latestVersion, currentVersion]
	} catch (error) {
	  	loginator(`Error occurred while checking for the latest version: ${error.message}`, `oops`);
	}
  
	return false;
}
  
checkLatestVersion()
	.then(result => {
	  	if (result[0] === true) {
			loginator(`You may need to update your bot! Version from latest release does not match your version.\nLatest: ${result[1]}\nLocal: ${result[2]}\nIf you're developing a new version for a PR, note that only 182exe handles version control, so don't worry about changing the version in package.json.`, `warn`)
		}
	})
	.catch(error => {
	  	loginator(`A problem happened during version check: ${error}`, `oops`);
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