import { Constants, MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Utilities',
    description: 'Sends an announcement',
    slash: true,
    options: [
        {
            'name': 'title',
            'description': 'The title for the announcement',
            'required': true,
            'type': Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            'name': 'description',
            'description': 'The description for the announcement',
            'required': true,
            'type': Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            'name': 'channel',
            'description': 'The channel to send the announcement in',
            'required': true,
            'type': Constants.ApplicationCommandOptionTypes.CHANNEL
        }
    ],

    callback: async ({ interaction }) => {
        const channel = interaction.options.getChannel('channel')! as TextChannel;
        const title = interaction.options.getString('title')!;
        const description = interaction.options.getString('description')!;

        const embed = new MessageEmbed()
            .setDescription(description)
            .setTitle(title)

        await channel.send({
            'embeds': [embed],
        })

        await interaction.reply({
            'content': 'Announcement sent.',
            'ephemeral': true
        })
    }
} as ICommand