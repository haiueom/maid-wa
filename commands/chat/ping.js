module.exports = async (client, message) => {
	return await client.sendImage(
		message.from,
		"./images/ping.jpg",
		"Ping",
		`🔰 *Pong!* 🔰`,
		message.id,
		true,
	);
};
