const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');

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
  	  	console.error('Error saving file:', err);
  	} else {
  	  	console.log('Saved commands locally in commands_generated.json!');
  	}
});

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();