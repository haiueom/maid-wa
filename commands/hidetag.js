module.exports = async (client, message, config, utils) => {
	const { adminOnly, groupOnly } = utils;
	const isGroup = await groupOnly(client, message, config);
	const isAdmin = await adminOnly(client, message, config);
	if (!isGroup || !isAdmin) return;
	const text = message.body.split(" ").slice(1).join(" ");
	const members = await client.getGroupMembersId(message.chat.id);
	await client.sendReplyWithMentions(
		message.from,
		`🔰 *Info Penting!* 🔰\n================\n\n${text}`,
		message.id,
		true,
		members
	);
};
