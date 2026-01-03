const { bold, EmbedBuilder, SlashCommandBuilder } = require('discord.js'); // bold font, embeds, slash commands

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('responds with bot\'s ping'),
    async execute(interaction) {
        const pingEmbed = new EmbedBuilder()
        .setColor(0x8686af)
        .setAuthor({ name: 'Pong!', iconURL: interaction.client.user.displayAvatarURL() })
        .setDescription('Pinging...')
        .setTimestamp()
        .setFooter({ text: '☆' });

        await interaction.reply({ embeds: [pingEmbed] });
        const message = await interaction.fetchReply(); // fetch response

        const gateway = interaction.client.ws.ping;
        const roundTrip = message.createdTimestamp - interaction.createdTimestamp; // response time - call time

        pingEmbed.setDescription(`${bold('Gateway')}: ${gateway} ms\n${bold('Round-Trip')}: ${roundTrip} ms`); // update embed description with latencies

        await interaction.editReply({ embeds: [pingEmbed] });
    }
};
