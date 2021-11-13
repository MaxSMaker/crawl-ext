var eventIndex = 0;
var regex = /^[A-Z]+$/

module.exports.message = function (channel, tags, message, self) {
    // console.log(`${tags['display-name']}: ${message}`);

    if (!message.startsWith("!")) {
        return;
    }

    var event = message.slice(1).split(' ', 1).shift();
    if (!regex.test(event)) {
        return;
    }

    console.log(`EXT.events["${eventIndex}"] = "${event}"`);
    eventIndex++;
}
