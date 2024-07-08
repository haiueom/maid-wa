const { formatNum } = require("../../libs/utils");

module.exports = async (client, message) => {
	return await client.sendImage(
		message.from,
		message.sender.profilePicThumbObj.imgFull,
		message.sender.verifiedName || message.sender.pushname,
		`🔰 *Information* 🔰\n===============\n*Name*: ${
			message.sender.verifiedName || message.sender.pushname
		}\n*Number*: +${formatNum(message.sender.id)}\nType: ${
			message.sender.isBusiness ? "WhatsApp Business" : "WhatsApp Normal"
		}`,
		message.id,
		true
	);
};
