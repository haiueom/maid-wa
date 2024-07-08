const { payment } = require("../../config.json");

module.exports = async (client, message) => {
	let pesan = "";
	payment.forEach((data, index) => {
		pesan += `✅ *${data.nama}*\n`;
		pesan += `${data.an} - ${data.norek}`;
		if (index < payment.length - 1) {
			pesan += "\n\n";
		}
	});
	return await client.sendImage(
		message.from,
		"./images/payment.jpg",
		"Payment",
		`🔰 *Payment* 🔰\n=============\n\n${pesan}`,
		message.id,
		true
	);
};
