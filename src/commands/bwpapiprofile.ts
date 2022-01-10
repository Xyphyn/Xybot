import { Constants } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'BWP Api',
    description: 'Gets the profile info a user',
    slash: true,
    testOnly: true,
    options: [
        {
            name: 'user',
            description: 'the user duh',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    callback: ({ interaction }) => {
        return 'bro this isn\'t ready yet'
    }
} as ICommand