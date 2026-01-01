const { REST, Routes } = require('discord.js'); // REST API calls, API endpoint URLs
require('dotenv').config(); // load .env variables
const fs = require('node:fs'); // file system
const path = require('node:path'); // path

const commands = []; // commands array

// get command module folders
const commandFoldersPath = path.join(__dirname, 'modules', 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const commandFolder of commandFolders) {
    // get command module files
    const commandFilesPath = path.join(commandFoldersPath, commandFolder);
    const commandFiles = fs.readdirSync(commandFilesPath).filter((file) => file.endsWith('.js'));
    for (const commandFile of commandFiles) {
        // push toJSON() output of command data into commands array
        const commandFilePath = path.join(commandFilesPath, commandFile);
        const command = require(commandFilePath);
        if ('data' in command && 'execute' in command) commands.push(command.data.toJSON());
        else console.warn(`[WARNING] Command at ${commandFilePath} is missing 'data' or 'execute'`);
    }
}

const rest = new REST().setToken(process.env.TOKEN); // REST module object
(async () => { try { await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands }); } catch (error) { console.error(error); } })(); // deploy commands
