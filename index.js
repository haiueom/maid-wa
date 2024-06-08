const wa = require("@open-wa/wa-automate");
const config = require("./config.json");

wa.create({
	sessionId: config.name,
	multiDevice: true, //required to enable multiDevice support
	authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
	blockCrashLogs: true,
	disableSpins: true,
	headless: "new",
	hostNotificationLang: "ID_ID",
	logConsole: false,
	popup: true,
	debugger: true,
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
		const isOwner = message.sender.id === config.ownerId + "@c.us";
		const isAdmin = config.adminId.includes(formatNum(message.sender.id));
		const isAllowed = isOwner || isAdmin;
		const isGroup = message.isGroupMsg;

		async function notAllowed() {
			await client.reply(
				message.from,
				"Maaf, perintah ini hanya dapat digunakan oleh owner atau admin",
				message.id
			);
		}

		async function notGroup() {
			await client.reply(
				message.from,
				"Maaf, perintah ini hanya dapat digunakan di dalam grup",
				message.id
			);
		}

		function formatNum(num) {
			return num.split("@")[0];
		}

		// menu command
		if (message.body.match(new RegExp(`^${config.prefix}menu$`))) {
			await client.reply(
				message.from,
				`🔰 *Menu* 🔰\n==========\nPrefix: ${config.prefix}\n\n- menu\n- about\n- ping\n- echo <text>\n- me\n- all <text>`,
				message.id
			);
		}

		// about command
		if (message.body.match(new RegExp(`^${config.prefix}about$`))) {
			await client.reply(
				message.from,
				`🔰 *${config.name}* 🔰\n==================\n${config.desc}\n\nCreated by: \`${config.owner}\``,
				message.id
			);
		}

		// ping command
		if (message.body.match(new RegExp(`^${config.prefix}ping$`))) {
			await client.reply(message.from, `🔰 *Pong!* 🔰`, message.id);
		}

		// echo command
		if (message.body.match(new RegExp(`^${config.prefix}echo`))) {
			if (!isAllowed) return notAllowed();
			const text = message.body.split(" ").slice(1).join(" ");
			await client.sendText(message.from, text);
		}

		// payment command
		if (message.body.match(new RegExp(`^${config.prefix}payment$`))) {
			if (!isAllowed) return notAllowed();
			await client.sendImage(
				message.from,
				"./images/kucing.jpeg",
				"Payment",
				`🔰 *Payment* 🔰\n=============\n\n✅ *Dana/ShopeePay/GoPay*\nIlham Taufiq - 08xxx\n\n✅ *Bank Jago Syariah*\nIlham Taufiq - xxx\n\n✅ *Bank Syariah Indonesia (BSI)*\nIlham Taufiq - xxx`
			);
		}

		// me command
		if (message.body.match(new RegExp(`^${config.prefix}me$`))) {
			if (!isAllowed) return notAllowed();
			await client.sendImage(
				message.from,
				message.sender.profilePicThumbObj.imgFull,
				message.sender.verifiedName || message.sender.pushname,
				`🔰 *Information* 🔰\n===============\n*Name*: ${
					message.sender.verifiedName || message.sender.pushname
				}\n*Number*: +${formatNum(message.sender.id)}\nType: ${
					message.sender.isBusiness
						? "WhatsApp Business"
						: "WhatsApp Normal"
				}`,
				message.id
			);
		}

		// all command
		if (message.body.match(new RegExp(`^${config.prefix}all`))) {
			if (!isAllowed) return notAllowed();
			if (!isGroup) return notGroup();
			const text = message.body.split(" ").slice(1).join(" ");
			const members = await client.getGroupMembersId(message.chat.id);
			await client.sendReplyWithMentions(
				message.from,
				`🔰 *Info Penting!* 🔰\n================\n\n${text}`,
				message.id,
				true,
				members
			);
		}

		// members command
		if (message.body.match(new RegExp(`^${config.prefix}members$`))) {
			if (!isAllowed) return notAllowed();
			if (!isGroup) return notGroup();
			const members = await client.getGroupMembers(message.from);
			let text = `🔰 *Members* 🔰\n==============\nTotal: ${members.length}`;
			await client.reply(message.from, text, message.id);
		}
	});
}
