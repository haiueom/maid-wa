const { name, desc, owner } = require("../../config.json");

module.exports = async (client, message) => {
	return await client.sendImage(
		message.from,
		"./images/maid.jpg",
		"About",
		`🔰 *${name}* 🔰\n==================\n${desc}\n\nCreated by: \`${owner}\``,
		message.id,
		true
	);
};
