const sharp = require("sharp");
const { owner, name } = require("../../config.json");

async function decryptMedia(client, message) {
    try {
        return await client.decryptMedia(message);
    } catch (error) {
        console.error('Error decrypting media:', error);
        throw new Error('Error decrypting media');
    }
}

function extractImageData(imgBuffer) {
    const matches = imgBuffer.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid image data');
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
        console.error('Error processing image:', error);
        throw new Error('Error processing image');
    }
}

async function sendSticker(client, message, imageData, mime_type) {
    const imgDataUri = `data:${mime_type};base64,${imageData.toString("base64")}`;
    try {
        await client.sendImageAsSticker(message.from, imgDataUri, {
            author: owner,
            pack: name,
        });
    } catch (error) {
        console.error('Error sending sticker:', error);
        await client.sendText(message.from, "Terjadi kesalahan");
    }
}

module.exports = async (client, message) => {
    try {
        const imgBuffer = await decryptMedia(client, message);
        const imageBuffer = extractImageData(imgBuffer);
        const processedImage = await processImage(imageBuffer);
        await sendSticker(client, message, processedImage, message.mimetype);
    } catch (error) {
        console.error('Error in sticker creation process:', error);
    }
};
