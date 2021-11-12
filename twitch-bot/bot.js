const tmi = require('tmi.js');

const args = process.argv.slice(2)
const client = new tmi.Client({
	channels: args
});

client.connect();
var eventIndex = 0;
var regex = /^[A-Z]+$/

client.on('message', (channel, tags, message, self) => {
	// console.log(`${tags['display-name']}: ${message}`);

	if (!message.startsWith("!")) {
		return;
	}

	var event = message.slice(1).split().shift();
	if (!regex.test(event)) {
		return;
	}

	console.log(`EXT.events["${eventIndex}"] = "${event}"`);
	eventIndex++;
});
