import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import path from 'path'

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
})

let api_keys = new Map();

client.on('ready', () => {
    console.info('[DISCORD] Bot is ready');

    new WOKCommands(client, {
        commandDir: path.join(__dirname, 'commands'),
        testServers: ['919378203208994876', '910590420604575765', '941415895635484742'],
    })
})

client.login(process.env.TOKEN)