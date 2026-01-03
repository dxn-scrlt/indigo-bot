const { Events, MessageFlags } = require('discord.js'); // events, message flags

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return; // ignore non-command interactions

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`Command ${interaction.commandName} not found`);
            return;
        }

        try { await command.execute(interaction); } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) await interaction.followUp({ content: 'Error executing command', flags: MessageFlags.Ephemeral }); // follow-up with error response
            else await interaction.reply({ content: 'Error executing command', flags: MessageFlags.Ephemeral }); // reply with error response
        }
    }
};
