const sharp = require("sharp");

async function decryptMedia(client, message) {
	try {
		return await client.decryptMedia(message);
	} catch (error) {
		console.error(`Error decrypting media: ${error}`);
		throw new Error("Error decrypting media");
	}
}

function extractImageData(imgBuffer) {
	const matches = imgBuffer.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	if (!matches) throw new Error("Invalid image data");
	return Buffer.from(matches[2], "base64");
}

async function processImage(imageBuffer) {
	try {
		return await sharp(imageBuffer)
			.resize({
				width: 512,
				height: 512,
				fit: "cover",
				position: "center",
			})
			.png()
			.toBuffer();
	} catch (error) {
		console.error(`Error processing image: ${error}`);
		throw new Error("Error processing image");
	}
}

async function sendImage(client, message, imgDataUri, mime_type) {
	try {
		const response = await client.sendImage(
			message.from,
			imgDataUri,
			"cropped-image",
			"Berhasil memotong gambar",
			message.id,
			true
		);
		return response;
	} catch (error) {
		console.error(`Error sending image: ${error}`);
		throw new Error("Error sending image");
	}
}

module.exports = async (client, message) => {
	try {
		const imgBuffer = await decryptMedia(client, message);
		const imageBuffer = extractImageData(imgBuffer);
		const processedImage = await processImage(imageBuffer);
		const imgDataUri = `data:${
			message.mimetype
		};base64,${processedImage.toString("base64")}`;
		await sendImage(client, message, imgDataUri, message.mimetype);
	} catch (error) {
		console.error(`Error in image processing flow: ${error}`);
	}
};
