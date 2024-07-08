const { prefix } = require("../../config.json");

module.exports = async (client, message) => {
	return await client.sendImage(
		message.from,
		"./images/maid.jpg",
		"Menu",
		`🔰 *Menu* 🔰\n==========\nPrefix: ${prefix}\n\n- menu\n- about\n- ping\n- echo <text>\n- me\n- hidetag <text>\n- sticker\n- crop`,
		message.id,
		true
	);
};
