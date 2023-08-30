import { onObjectFinalized } from "firebase-functions/v2/storage";
import logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";

const IS_TEST_MODE = process.env.NEXT_PUBLIC_IS_TEST_MODE === "true";

if (IS_TEST_MODE) {
	logger.warn("⚠️ Running in test mode");
}

function removeFileExtension(filePath = "", extension = "") {
	return filePath.replace(extension, "");
}

/*
	Step 3 in the extension pipeline: Handle the transcribed audio file
*/
export const handleAudioFile = onObjectFinalized(async ({ data }) => {
	const functionName = "Handle Audio File:";
	logger.info(`${functionName} Starting`);
	const filePath = data.name;

	if (!filePath.endsWith(".mp3") || !data.contentType.startsWith("audio/")) {
		logger.info(
			`${functionName} File: "${filePath}" is not an mp3 file, skipping`,
		);
		return;
	}
	logger.info(`${functionName} Processing file: "${filePath}"`);

	const documentId = removeFileExtension(filePath, ".mp3").replace(
		"tts/",
		"",
	);
	logger.info(`${functionName} Document ID to update: ${documentId}`);
	const documentRef = getFirestore().collection("bot").doc(documentId);

	try {
		await documentRef.update({
			audio: filePath,
		});
	} catch (error) {
		logger.error(`${functionName} Error updating document:`, error);
		return;
	}

	logger.info(`${functionName} Finished: Audio file URL saved to Firestore`);

	return;
});
