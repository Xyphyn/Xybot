import { BaseMessageComponentOptions, ButtonInteraction, Constants, Interaction, MessageActionRow, MessageActionRowOptions, MessageButton, MessageComponentInteraction, MessageEmbed, User } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Games',
    description: 'Creates a poll',

    slash: true,
    testOnly: true,

    options: [
        {
            name: 'normal',
            description: 'normal poll',
            type: 'SUB_COMMAND',
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
                    name: 'time',
                    description: 'The time in seconds.',
                    required: false,
                    type: Constants.ApplicationCommandOptionTypes.NUMBER
                }
            ]
        },
        {
            name: 'live',
            description: 'live poll',
            type: 'SUB_COMMAND',
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
                }
            ]
        }
    ],

    callback: async ({ interaction: msgInteraction, client, channel }) => {
        
        switch (msgInteraction.options.getSubcommand()) {
            case "normal":
                var row1: Required<BaseMessageComponentOptions> & MessageActionRowOptions

                var _time: any
                if (msgInteraction.options.getNumber('time') == undefined) _time = 30
                else _time = msgInteraction.options.getNumber('time')!
                if (_time! > 600 || _time! < 5) {
                    msgInteraction.reply({
                        content: "invalid time.",
                        ephemeral: true
                    })
                }

                var option1button = new MessageButton()
                option1button.setCustomId('option1')
                option1button.setLabel(msgInteraction.options.getString('option1')!)
                option1button.setStyle('PRIMARY')

                var option2button = new MessageButton()
                option2button.setCustomId('option2')
                option2button.setLabel(msgInteraction.options.getString('option2')!)
                option2button.setStyle('PRIMARY')

                row1 = new MessageActionRow()
                    .addComponents(
                        option1button, option2button
                    )
                

                var optionsDict = new Map()

                try {
                    const embed = new MessageEmbed().setTitle(msgInteraction.options.getString('question')!).setDescription(`Ends in ${_time} seconds\nYou cannot change your answer after you click a button.`)
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

                const filter = async (btnInt: MessageComponentInteraction) => {
                    try {
                        return !(btnInt.user.id in optionsDict.values)
                    } catch (TypeError) {
                        return true
                    }
                }

                var collector = channel.createMessageComponentCollector({
                    filter,
                    max: 1000,
                    time: _time! * 1000,
                })

                collector.on('collect', (i: Interaction) => {
                    collector.collected.forEach((click) => {
                        click.deferUpdate()
                        optionsDict.set(click.user.id, click.customId)
                    })
                    collector.collected.clear()
                })

                collector.on('end', (collection, i: Interaction) => {
                    var embed = new MessageEmbed()
                    embed.setTitle('Poll Results')
                    var option1count = 0
                    var option2count = 0
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
                break
            case 'live':
                var row1: Required<BaseMessageComponentOptions> & MessageActionRowOptions
                const option1emoji = msgInteraction.options.getString('option1emoji')
                const option2emoji = msgInteraction.options.getString('option2emoji')

                var option1button = new MessageButton()
                option1button.setCustomId('option1')
                option1button.setLabel(msgInteraction.options.getString('option1')!)
                if (option1emoji !== undefined) option1button.setEmoji(option1emoji!)
                option1button.setStyle('PRIMARY')

                var option2button = new MessageButton()
                option2button.setCustomId('option2')
                option2button.setLabel(msgInteraction.options.getString('option2')!)
                if (option2emoji !== undefined) option2button.setEmoji(option2emoji!)
                option2button.setStyle('PRIMARY')

                row1 = new MessageActionRow()
                    .addComponents(
                        option1button, option2button
                    )
                

                var optionsDict = new Map()

                try {
                    const embed = new MessageEmbed().setTitle(msgInteraction.options.getString('question')!).setDescription('Choose wisely.')
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
        

                var livefilter = async (btnInt: MessageComponentInteraction) => {
                    try {
                        var message = await msgInteraction.fetchReply()
                        if(btnInt.message.id == message.id) return true
                        else return false
                    } catch (TypeError) {
                        return true
                    }
                }

                var collector = channel.createMessageComponentCollector({
                    filter: livefilter,
                    time: 604800000,
                })

                collector.on('collect', (i: Interaction) => {
                    

                    var embed = new MessageEmbed()
                    embed.setTitle(msgInteraction.options.getString('question')!);
                    var option1count = 0
                    var option2count = 0
                    
                    collector.collected.forEach((click) => {
                        if (click.customId == option1button.customId) optionsDict.set(click.user.id, 'option1')
                        else optionsDict.set(click.user.id, 'option2')
                        
                        for (const [key, value] of optionsDict) {
                            if (value === 'option1') option1count++
                            else if (value === 'option2') option2count++
                        }
                        click.deferUpdate()
                    })

                    embed.addField(msgInteraction.options.getString('option1')!, option1count.toString())
                    embed.addField(msgInteraction.options.getString('option2')!, option2count.toString())

                    msgInteraction.editReply({
                        content: 'Poll',
                        embeds: [embed],
                        components: [ row1 ]
                    })

                    collector.collected.clear()
                })

                collector.on('end', (collection, i: Interaction) => {
                    msgInteraction.editReply({
                        content: 'Poll ended. Something broke.',
                        components: []
                    })
                })
            break
        }
    }
} as ICommand