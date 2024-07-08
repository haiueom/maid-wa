const { cekGroup } = require("../../libs/utils");

module.exports = async (client, message) => {
	const isGroup = await cekGroup(client, message);
	if (!isGroup) return;
	const members = await client.getGroupMembers(message.from);
	let text = `🔰 *Members* 🔰\n==============\n\nTotal: ${members.length}`;
	return await client.reply(message.from, text, message.id);
};
