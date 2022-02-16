import { ICommand } from "wokcommands";
import { Constants, GuildMember, MessageEmbed, Role } from "discord.js";

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
        const _role = interaction.options.getRole('role')!
        let embed = new MessageEmbed().setTitle(`Users of role ${_role.name}`)
        let role = interaction.guild?.roles.cache.get(_role.id)
        let arr = ""
        console.log(role!.members)
        role!.members.forEach(element => {
            arr += element.user.username
        });
        console.log(arr);
        embed.setDescription(arr)

        interaction.reply({
            content: ".",
            embeds: [embed]
        })
    }
} as ICommand