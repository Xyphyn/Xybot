import { ICommand } from "wokcommands";
import { Constants, MessageEmbed } from 'discord.js'

export default {
    category: 'Utilities',
    description: 'Sends an embed',

    slash: true,
    testOnly: true,

    options: [
        {
            name: 'title',
            description: 'The title to embed',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'description',
            description: 'The description to embed',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        // {
        //     name: 'Color',
        //     description: 'duh the color',
        //     required: false,
        //     type: Constants.ApplicationCommandOptionTypes.STRING
        // }
    ],

    callback: ({ interaction }) => {
        const embed = new MessageEmbed()
            .setDescription(interaction.options.getString('description')!)
            .setTitle(interaction.options.getString('title')!)

        return embed;
    }
} as ICommand