import { Constants } from "discord.js";
import { ICommand } from "wokcommands";
import api_keys from "../index";

export default {
    category: 'BWP Api',
    description: 'Sets the BWP Api Key',
    testOnly: true,
    slash: true,
    options: [
        {
            name: 'key',
            description: 'The BWP Api Key',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    callback: async ({ interaction, client }) => {
        const key = interaction.options.getString('key')!;

        api_keys.set(interaction.user.username, key)

        await interaction.reply({
            content: 'BWP Api Key set.',
            ephemeral: true
        });
    }
} as ICommand