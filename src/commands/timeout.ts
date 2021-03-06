import { ICommand } from "wokcommands";
import { Constants, GuildMember, Interaction } from "discord.js";
import ms from 'ms';

export default {
    category: 'Moderation',
    description: 'Timeouts a user.',

    slash: true,
    testOnly: true,

    permissions: ['MUTE_MEMBERS'],

    options: [
        {
            name: 'user',
            description: 'The user to timeout',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.USER
        },
        {
            name: 'time',
            description: 'The time to timeout member.',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'reason',
            description: 'Reason to timeout member.',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'silent',
            description: 'Whether to make it silent.',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.BOOLEAN
        }
    ],

    callback: async ({ client, interaction }) => {
        const user = interaction.options.getUser('user')!
        const member = await interaction.guild!.members.fetch(user.id)
        const reason = interaction.options.getString('reason')
        const time = ms(interaction.options.getString('time')!)

        if (!time) {
            interaction.reply({
                content: 'Given time is not valid.',
                ephemeral: true
            })
        } else {
            try {
                const response = await member.timeout(time, reason!)

                interaction.reply({
                    content: `Timed out \`${user.username}\`. Reason: **${reason}**`,
                    ephemeral: interaction.options.getBoolean('silent')!
                })
            } catch {
                interaction.reply({
                    content: "Failed to timeout. Maybe the user can't be timed out?",
                    ephemeral: interaction.options.getBoolean('silent')!
                })
            }
        }
    }
} as ICommand