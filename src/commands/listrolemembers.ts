import { ICommand } from "wokcommands";
import { Constants, MessageEmbed, Role } from "discord.js";

export default {
    category: 'Utility',
    description: 'Gets all users of a role.',

    slash: true,
    testOnly: true,

    options: [
        {
            name: 'role',
            description: 'The role to get users of.',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.ROLE
        },
    ],
    
    callback: async ({ interaction }) => {
        interaction.deferReply()
        const role = interaction.options.getRole('role')!
        let embed = new MessageEmbed().setTitle(`Users of ${role.name}`)
        const membersWithRole = interaction.guild?.roles.cache.get(role.id)?.members
        let arr = ""
        for (let member in membersWithRole?.values) {
            arr += (`**${member}** `)
        }
        embed.setDescription(arr)

        interaction.reply({
            content: ".",
            embeds: [embed]
        })
    }
} as ICommand