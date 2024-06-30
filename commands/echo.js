module.exports = async (client, message, config, utils) => {
	let { adminOnly } = utils;
	const isAdmin = await adminOnly(client, message, config);
	if (!isAdmin) return;
	const text = message.body.split(" ").slice(1).join(" ");
	return await client.sendText(message.from, text);
};
