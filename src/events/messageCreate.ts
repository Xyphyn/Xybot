import { Message } from "discord.js";
import fs from 'fs'

const blacklist = fs.readFileSync('src/blacklist.txt').toString()
const whitelist = fs.readFileSync('src/whitelist.txt').toString()

module.exports = {
    name: 'messageCreate',
    async execute(message: Message) {
        if (message.author.bot) { return }
        
        // check for words in blacklist
        for (const word of message.content.split(' ')) {
            if (blacklist.search(word) == -1) { return }
            if (whitelist.search(word) != -1) { return }

            await message.reply({
                content: `<@${message.author.id}>, please do not say that word!`
            })

            await message.delete()
        }
    }
}