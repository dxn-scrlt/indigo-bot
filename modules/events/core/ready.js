const { ActivityType, Events } = require('discord.js'); // activity types, events

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setPresence({ activities: [{ name: 'Happy New Year!', type: ActivityType.Watching }], status: 'dnd' });
        console.log(`Logged in as ${client.user.tag}`);
    }
};
