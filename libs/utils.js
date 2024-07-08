const { ownerId, groupOnly, adminId } = require("../config.json");

async function formatNum(num) {
	return num.split("@")[0];
}

async function kirimPesan(client, from, message, id = null) {
	try {
		if (id) {
			await client.reply(from, message, id);
		} else {
			await client.sendText(from, message);
		}
	} catch (error) {
		console.error("Error sending message:", error);
	}
}

async function cekAdmin(client, message) {
	const isOwner = message.sender.id === `${ownerId}@c.us`;
	const isAdmin = adminId.includes(await formatNum(message.sender.id));
	const isAllowed = isOwner || isAdmin;
	const pesan =
		"Maaf, perintah ini hanya dapat digunakan oleh owner atau admin";

	if (!isAllowed) {
		await kirimPesan(client, message.from, pesan, message.id);
	}

	return isAllowed;
}

async function cekGroup(client, message) {
	const isGroup = message.isGroupMsg || groupOnly;
	const pesan = "Maaf, perintah ini hanya dapat digunakan di dalam grup";

	if (!isGroup) {
		await kirimPesan(client, message.from, pesan, message.id);
	}

	return isGroup;
}

module.exports = {
	formatNum,
	kirimPesan,
	cekAdmin,
	cekGroup,
};
