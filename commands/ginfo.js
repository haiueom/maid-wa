module.exports = async (client, message, config, utils) => {
	const { groupOnly } = utils;
	const isGroup = await groupOnly(client, message, config);
	if (!isGroup) return;
	const members = await client.getGroupMembers(message.from);
	let text = `🔰 *Members* 🔰\n==============\nTotal: ${members.length}`;
	return await client.reply(message.from, text, message.id);
};
