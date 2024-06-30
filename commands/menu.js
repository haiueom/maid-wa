module.exports = async (client, message, config, utils) => {
	return await client.reply(
		message.from,
		`🔰 *Menu* 🔰\n==========\nPrefix: ${config.prefix}\n\n- menu\n- about\n- ping\n- echo <text>\n- me\n- all <text>`,
		message.id
	);
};
