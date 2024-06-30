function formatNum(num) {
	return num.split("@")[0];
}

async function kirimPesan(client, from, message, id = null) {
	if (id) {
		await client.reply(from, message, id);
	} else {
		await client.sendText(from, message);
	}
}

async function adminOnly(client, message, config) {
	const isOwner = message.sender.id === config.ownerId + "@c.us";
	const isAdmin = config.adminId.includes(formatNum(message.sender.id));
	const isAllowed = isOwner || isAdmin;
	const pesan =
		"Maaf, perintah ini hanya dapat digunakan oleh owner atau admin";

	if (!isAllowed)
		await kirimPesan(client, message.from, pesan, message.id);

	return isAllowed ? true : false;
}

async function groupOnly(client, message, config) {
	const isGroup = message.isGroupMsg || config.groupOnly;
	const pesan = "Maaf, perintah ini hanya dapat digunakan di dalam grup";

	if (!isGroup)
		await kirimPesan(client, message.from, pesan, message.id);

	return isGroup ? true : false;
}

module.exports = {
	formatNum,
	kirimPesan,
	adminOnly,
	groupOnly,
};
