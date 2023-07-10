const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');
const { loginator } = require('./loginator');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());	
}

function createFormattedObject(commands) {
	const formattedData = commands.reduce((obj, item) => {
		obj[item.name] = {
			name: item.name,
			value: item.description,
	  	};
		return obj;
  	}, {});
  
	return formattedData;
};
const formattedObject = createFormattedObject(commands);
const formattedDataString = JSON.stringify(formattedObject, null, 2);

fs.writeFile('commands_generated.json', formattedDataString, 'utf8', (err) => {
  	if (err) {
  	  	loginator(`Problem occurred saving files to local cache: ${err}`, `oops`)
  	} else {
  	  	loginator(`Saved commands to cache -> commands_generated.json`, `info`)
  	}
});

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		loginator(`Started refreshing ${commands.length} application (/) commands.`, `info`);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		loginator(`Successfully reloaded ${data.length} application (/) commands.`, `info`);
	} catch (error) {
		loginator(`A problem occurred while loading commands into Discord`, `oops`)
	}
})();