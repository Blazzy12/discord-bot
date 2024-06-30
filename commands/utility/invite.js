// const { SlashCommandBuilder, ChannelType } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('invite')
//         .setDescription('Replies with an invite!')
//         .addChannelOption( option =>
//             option
//                 .setName('channel')
//                 .setDescription('The channel of the invite to be made')
//                 .setRequired(false)
//                 .addChannelTypes(ChannelType.GuildText)
//         ),
//     async execute(interaction) {
//         const channel = interaction.options.getChannel('channel');

//         const invite = await channel.createInvite();

//         await interaction.reply(`https://discord.gg/${invite.code}`)
//     }
// };

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Create a temp invite for your fellow mates. Only one use..')
        .addStringOption(option =>
            option.setName('reason').setDescription('The reason for inviting said person.').setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('invite-age').setDescription('The invite age (IN SECONDS: Default 60s, Max 300s').setRequired(false)
        )
        .addChannelOption(option =>
            option.setName('channel').setDescription("The channel you want the invite for.").setRequired(false)
        ),
    async execute(interaction) {
        const {options} = interaction;
        const channel = options.getChannel('channel') || interaction.channel;
        let maxAge = options.getInteger('invite-age');
        let reason = options.getString('reason');

        if (maxAge < 60 ) maxAge = 60;
        if (maxAge > 300 ) maxAge = 300;

        const invite = await channel.createInvite({ maxAge: maxAge });

        let time = Date.now();

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`Invite Generator`)
            .addFields({ name: `🔗 Invite Link`, value: `https://discord.gg/${invite.code} or ${invite.code}`})
            .addFields({ name: `📜 Invite Age`, value: `${maxAge} | Expires in <t:${Math.round(time / 1000 + maxAge)}:R>`})
            .addFields({ name: `🏠 Invite Channel`, value: `${channel}` })
            .addFields({ name: `🖹 Reason for Invite`, value: `${reason}`})
            .setTimestamp()

        await interaction.reply({embeds: [embed]})
    }
};