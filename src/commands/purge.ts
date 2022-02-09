import { ICommand } from "wokcommands";
import { Constants } from "discord.js";

export default {
    category: 'Moderation',
    description: 'Deletes x amount of messages.',

    slash: true,
    testOnly: true,

    permissions: ['MANAGE_MESSAGES'],

    options: [
        {
            name: 'amount',
            description: 'The number of messages to delete',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],

    callback: async ({ interaction, channel }) => {
        channel.bulkDelete(interaction.options.getNumber('amount')!, true).catch(err => {
            interaction.reply({
                content: "There was an error purging messages.",
                ephemeral: true
            })
        })
    }
} as ICommand