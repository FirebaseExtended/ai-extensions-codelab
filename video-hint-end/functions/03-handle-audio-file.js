/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
