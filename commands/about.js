module.exports = async (client, message, config, utils) => {
	return await client.reply(
		message.from,
		`🔰 *${config.name}* 🔰\n==================\n${config.desc}\n\nCreated by: \`${config.owner}\``,
		message.id
	);
};
