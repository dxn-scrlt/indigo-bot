const { Client, Collection, GatewayIntentBits } = require('discord.js'); // Client object, discord.js Map, gateway intents
require('dotenv').config(); // load .env variables
const fs = require('node:fs'); // file system
const path = require('node:path'); // path

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.MessageContent] }); // Client object
client.commands = new Collection();

// get module folders
const moduleFoldersPath = path.join(__dirname, 'modules');
const commandFoldersPath = path.join(moduleFoldersPath, 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath);
const eventFoldersPath = path.join(moduleFoldersPath, 'events');
const eventFolders = fs.readdirSync(eventFoldersPath);

for (const commandFolder of commandFolders) {
    // get command module files
    const commandFilesPath = path.join(commandFoldersPath, commandFolder);
    const commandFiles = fs.readdirSync(commandFilesPath).filter((file) => file.endsWith('.js'));
    for (const commandFile of commandFiles) {
        // register commands on Client object's Collection
        const commandFilePath = path.join(commandFilesPath, commandFile);
        const command = require(commandFilePath);
        if ('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
        else console.warn(`[WARNING] Command at ${commandFilePath} is missing 'data' or 'execute'`);
    }
}

for (const eventFolder of eventFolders) {
    // get event module files
    const eventFilesPath = path.join(eventFoldersPath, eventFolder);
    const eventFiles = fs.readdirSync(eventFilesPath).filter((file) => file.endsWith('.js'));
    for (const eventFile of eventFiles) {
        // register event handlers on Client object
        const eventFilePath = path.join(eventFilesPath, eventFile);
        const event = require(eventFilePath);
        if (event.once) client.once(event.name, (...args) => event.execute(...args));
        else client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(process.env.TOKEN); // login Client object
