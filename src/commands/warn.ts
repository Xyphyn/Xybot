import { ICommand } from "wokcommands";
import { Constants, GuildMember, Interaction } from "discord.js";
import ms from 'ms';

export default {
    category: 'Moderation',
    description: 'Warns a user.',

    slash: true,
    testOnly: true,

    permissions: ['MUTE_MEMBERS'],

    options: [
        {
            name: 'user',
            description: 'The user to warn',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.USER
        },
        {
            name: 'reason',
            description: 'Reason to warn member.',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],

    callback: async ({ client, interaction }) => {
        const user = interaction.options.getUser('user')!
        const member = await interaction.guild!.members.fetch(user.id)
        const reason = interaction.options.getString('reason')

        interaction.reply({
            content: `<@${user.id}>, please don't do that! \`${reason}\``
        })
    }
} as ICommand