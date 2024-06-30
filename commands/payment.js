module.exports = async (client, message, config, utils) => {
	return await client.sendImage(
		message.from,
		"./images/kucing.jpeg",
		"Payment",
		`🔰 *Payment* 🔰\n=============\n\n✅ *Dana/ShopeePay/GoPay*\nIlham Taufiq - 08xxx\n\n✅ *Bank Jago Syariah*\nIlham Taufiq - xxx\n\n✅ *Bank Syariah Indonesia (BSI)*\nIlham Taufiq - xxx`
	);
};
