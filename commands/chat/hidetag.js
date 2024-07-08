const { cekAdmin, cekGroup } = require("../../libs/utils");

module.exports = async (client, message) => {
	const isGroup = await cekGroup(client, message);
	const isAdmin = await cekAdmin(client, message);
	if (!isGroup || !isAdmin) return;
	const text = message.body.split(" ").slice(1).join(" ");
	const members = await client.getGroupMembersId(message.chat.id);
	return await client.sendReplyWithMentions(
		message.from,
		`🔰 *Info Penting!* 🔰\n================\n\n${text}`,
		message.id,
		true,
		members
	);
};
