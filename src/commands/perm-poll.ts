import { ButtonInteraction, Constants, Interaction, MessageActionRow, MessageButton, MessageEmbed, User } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Games',
    description: 'Creates a poll',

    slash: true,
    testOnly: true,

    options: [
        {
            name: 'question',
            description: 'The question for the poll',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'option1',
            description: 'The first option for the poll',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'option2',
            description: 'The second option for the poll',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'option1emoji',
            description: 'The emoji for the first option',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'option2emoji',
            description: 'The emoji for the second option',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],

    callback: async ({ interaction: msgInteraction, client, channel }) => {
        let row1
        const option1emoji = msgInteraction.options.getString('option1emoji')
        const option2emoji = msgInteraction.options.getString('option2emoji')
        const title = msgInteraction.options.getString('title')

        let option1button = new MessageButton()
        option1button.setCustomId('option1')
        option1button.setLabel(msgInteraction.options.getString('option1')!)
        if (option1emoji !== undefined) option1button.setEmoji(option1emoji!)
        option1button.setStyle('PRIMARY')

        let option2button = new MessageButton()
        option2button.setCustomId('option2')
        option2button.setLabel(msgInteraction.options.getString('option2')!)
        if (option2emoji !== undefined) option2button.setEmoji(option2emoji!)
        option2button.setStyle('PRIMARY')

        row1 = new MessageActionRow()
            .addComponents(
                option1button, option2button
            )
        

        let optionsDict = new Map()

        try {
            const embed = new MessageEmbed().setTitle(msgInteraction.options.getString('question')!).setDescription('Ends in 30 seconds\nYou cannot change your answer after you click a button.')
            await msgInteraction.reply({
                content: 'Poll',
                embeds: [embed],
                components: [ row1 ]
            })
        } catch (DiscordAPIError) {
            await msgInteraction.reply('You managed to break something. How the heck? pls fix your command :thinking:')
            console.error(DiscordAPIError)
            return
        }

        const filter = (btnInt: Interaction) => {
            try {
                return !(btnInt.user.id in optionsDict.values)
            } catch (TypeError) {
                return true
            }
        }

        const collector = channel.createMessageComponentCollector({
            filter,
            max: 100,
            time: 604800000,
        })

        collector.on('collect', (i: Interaction) => {
            let embed = new MessageEmbed()
            embed.setTitle(title!);
            let option1count = 0
            let option2count = 0
            collector.collected.forEach((click) => {
                for (const [key, value] of optionsDict) {
                    if (value === 'option1') option1count++
                    else if (value === 'option2') option2count++
                }
                click.deferUpdate()
                optionsDict.set(click.user.id, click.customId)
            })

            embed.addField(msgInteraction.options.getString('option1')!, option1count.toString())
            embed.addField(msgInteraction.options.getString('option2')!, option2count.toString())

            msgInteraction.editReply({
                content: 'Poll',
                embeds: [embed]
            })

            collector.collected.clear()
        })

        collector.on('end', (collection, i: Interaction) => {
            let embed = new MessageEmbed()
            embed.setTitle('Poll Results')
            let option1count = 0
            let option2count = 0
            for (const [key, value] of optionsDict) {
                if (value === 'option1') option1count++
                else if (value === 'option2') option2count++
            }
            embed.addField(msgInteraction.options.getString('option1')!, option1count.toString())
            embed.addField(msgInteraction.options.getString('option2')!, option2count.toString())

            msgInteraction.editReply({
                content: 'Poll',
                embeds: [embed],
                components: []
            })
        })
    }
} as ICommand