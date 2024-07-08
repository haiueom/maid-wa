const { cekAdmin } = require("../../libs/utils");

module.exports = async (client, message) => {
	const isAdmin = await cekAdmin(client, message);
	if (!isAdmin) return;
	const text = message.body.split(" ").slice(1).join(" ");
	return await client.sendText(message.from, text);
};
