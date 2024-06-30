module.exports = async (client, message, config, utils) => {
	return await client.reply(message.from, "🔰 *Pong!* 🔰", message.id);
};
