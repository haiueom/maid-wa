const wa = require("@open-wa/wa-automate");
const config = require("./config.json");
const utils = require("./libs/utils");
const fs = require("fs");
const path = require("path");

wa.create({
	sessionId: config.name,
	multiDevice: true, //required to enable multiDevice support
	authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
	headless: "new",
	hostNotificationLang: "ID_ID",
	logConsole: false,
	qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then((client) => start(client));

function start(client) {
	client.onAddedToGroup(async (chat) => {
		await client.sendText(
			chat.groupMetadata.id,
			`🔰 *${config.name}* 🔰\n==================\nHalo, saya adalah bot yang dibuat oleh \`${config.owner}\`\n\nKetik \`${config.prefix}menu\` untuk melihat menu`
		);
	});
	client.onMessage(async (message) => {
		const commandFiles = fs
			.readdirSync(path.join(__dirname, "commands"))
			.filter((file) => file.endsWith(".js"));

		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			const commandName = file.split(".")[0];

			if (
				message.body.match(
					new RegExp(`^${config.prefix}${commandName}\\b`)
				)
			) {
				await command(client, message, config, utils);
				break;
			}
		}
	});
}
