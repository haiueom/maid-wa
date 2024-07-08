const wa = require("@open-wa/wa-automate");
const config = require("./config.json");
const fs = require("fs");
const path = require("path");

wa.create({
	sessionId: config.name,
	multiDevice: true,
	authTimeout: 0,
	headless: "new",
	hostNotificationLang: "ID_ID",
	qrTimeout: 0,
	restartOnCrash: start,
	useChrome: true,
	killProcessOnBrowserClose: true,
	throwErrorOnTosBlock: false,
	chromiumArgs: [
		"--no-sandbox",
		"--disable-setuid-sandbox",
		"--aggressive-cache-discard",
		"--disable-cache",
		"--disable-application-cache",
		"--disable-offline-load-stale-cache",
		"--disk-cache-size=0",
	],
})
	.then((client) => start(client))
	.catch((error) => {
		console.error("Error creating client:", error);
		process.exit(1);
	});

function start(client) {
	client.onStateChanged((state) => {
		console.log("[Client State]", state);
		if (state === "CONFLICT" || state === "UNLAUNCHED")
			client.forceRefocus();
	});

	client.onAck((x) => {
		const { from, to, ack } = x;
		if (x !== 3) client.sendSeen(to);
	});

	client.onAddedToGroup(async (chat) => {
		try {
			await client.sendText(
				chat.groupMetadata.id,
				`🔰 *${config.name}* 🔰\n==================\nHalo, saya adalah bot yang dibuat oleh \`${config.owner}\`\n\nKetik \`${config.prefix}menu\` untuk melihat menu`
			);
		} catch (error) {
			console.error("Error sending welcome message to group:", error);
		}
	});

	client.onMessage(async (message) => {
		try {
			client.getAmountOfLoadedMessages().then((msg) => {
				if (msg >= 3000) {
					client.cutMsgCache();
				}
			});
		} catch (error) {
			console.error("Error delete message cache:", error);
		}
		try {
			const commandFiles = getCommandFiles(message.type);
			for (const file of commandFiles) {
				const command = require(`./commands/${message.type}/${file}`);
				const commandName = file.split(".")[0];
				if (isValidCommand(message, commandName)) {
					client.simulateTyping(message.from, true);
					if (config.log)
						console.log(`${commandName} - ${message.from}`);
					await handleCommand(client, message, command);
					client.simulateTyping(message.from, false);
					break;
				}
			}
		} catch (error) {
			console.error("Error processing message:", error);
		}
	});
}

function getCommandFiles(type) {
	let commandFiles = [];
	try {
		const dir = path.join(__dirname, `commands/${type}`);
		if (fs.existsSync(dir)) {
			commandFiles = fs
				.readdirSync(dir)
				.filter((file) => file.endsWith(".js"));
		}
	} catch (error) {
		console.error(`Error reading command files for type ${type}:`, error);
	}
	return commandFiles;
}

function isValidCommand(message, commandName) {
	const prefixCommand = `${config.prefix}${commandName}`;
	const regex = new RegExp(`^${prefixCommand}\\b`);
	return (
		(message.type === "image" &&
			message.caption &&
			message.caption.match(regex)) ||
		(message.type === "chat" && message.body && message.body.match(regex))
	);
}

async function handleCommand(client, message, command) {
	await client.simulateTyping(message.from, true);
	try {
		await command(client, message);
	} catch (error) {
		console.error("Error executing command:", error);
	}
	await client.simulateTyping(message.from, false);
}
