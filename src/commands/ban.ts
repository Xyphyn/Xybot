import { ButtonInteraction, Interaction, MessageActionRow, MessageButton, Constants, GuildMember } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Moderation',
    description: 'Bans a user',
    
    slash: true,
    testOnly: true,

    permissions: ['MANAGE_GUILD'],

    options: [
        {
            name: 'user',
            description: 'The user to ban',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.USER
        },
        {
            name: 'reason',
            description: 'The reason for their ban.',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],

    callback: async ({ interaction: msgInt, channel }) => {
        const row1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('confirm')
                    .setEmoji('🔨')
                    .setLabel('Yes')
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                .setCustomId('unconfirm')
                .setLabel('No')
                .setStyle('DANGER')
            )


        await msgInt.reply({
            content: `Are you sure you want to ban ${msgInt.options.getMember('user')}?`,
            components: [ row1 ]
        })

        const filter = ( btnInt: Interaction ) => {
            return msgInt.user.id === btnInt.user.id
        }

        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 15
        })

        collector.on('collect', (i: Interaction) => {
            // Do nothing
        })

        collector.on('end', (collection, i: Interaction) => {
            // collection.forEach((click) => {
            //     channel.send(`${click.user.id} clicked ${click.customId}`)
            // })

            let info

            if (collection.first()?.customId == 'confirm') {
                const target = msgInt.options.getMember('user') as GuildMember

                if (target.bannable) {
                    target.ban({
                        reason: msgInt.options.getString('reason')!
                    })
                    info = 'User banned.'
                } else {
                    info = 'User is not bannable.'
                }
            } else if (collection.first()?.customId == 'unconfirm') {
                info = 'Ok, will not ban that user.'
            }

            msgInt.editReply({
                content: info,
                components: []
            })
        })
    }
} as ICommand