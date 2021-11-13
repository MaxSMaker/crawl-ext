const tmi = require('tmi.js');
const bot = require('./bot.js');

const args = process.argv.slice(2)
const client = new tmi.Client({
    channels: args
});

client.connect();
client.on('message', bot.message);

// client.on('raw_message', (messageCloned, message) => {
//     console.log(message);
// })
