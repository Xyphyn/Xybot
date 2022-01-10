import { ICommand } from "wokcommands";

export default {
    category: 'Utilities',
    description: 'Replies with API ping',

    slash: true,

    callback: ({ interaction, client }) => {
        interaction.reply({
            content: `Discord API ping is ${client.ws.ping}ms`,
            ephemeral: true
        })
    }
} as ICommand