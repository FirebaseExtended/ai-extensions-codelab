import { onObjectFinalized } from "firebase-functions/v2/storage";
import logger from "firebase-functions/logger";
import { getStorage } from "firebase-admin/storage";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const IS_TEST_MODE = process.env.NEXT_PUBLIC_IS_TEST_MODE === "true";

if (IS_TEST_MODE) {
	logger.warn("⚠️ Running in test mode");
}

/*
	Step 1 in the extension pipeline: process the users uploaded video file
*/
export const handleVideoUpload = onObjectFinalized(async ({ data }) => {
	const functionName = "Handle Video Upload:";
	logger.info(`${functionName} Starting`);
	const filePath = data.name;

	if (!filePath.endsWith(".mp4") || data.size < 100) {
		logger.info(
			`${functionName} File: "${filePath}" is not a video file, skipping`
		);
		return;
	}

	logger.info(`${functionName} Processing: ${filePath}`);

	const fileBucket = data.bucket;

	try {
		const bucket = getStorage().bucket(fileBucket);
		const [{ timeCreated, metadata }] = await bucket
			.file(filePath)
			.getMetadata();

		const videoDocument = {
			file: filePath,
			uid: metadata.uid,
			// Note: At this point, we want the firestore-palm-gen-text extension to skip processing of this document, since the prompt isn't ready yet
			// A status.state field of `PROCESSING` will cause the extension to skip this document
			status: {
				state: "PROCESSING",
			},
			timeCreated: Timestamp.fromDate(new Date(timeCreated)),
		};

		await getFirestore().collection("bot").add(videoDocument);
	} catch (error) {
		logger.error(
			`${functionName} Error: There was a problem downloading the media metadata and writing it to Firestore`,
			error
		);
		return;
	}

	if (IS_TEST_MODE) {
		/***********
		 * TESTING CODE ONLY
		 * *********/
		const { cwd } = await import("node:process");

		const jsonFilePath = `${filePath}.json`;
		const localJSONFile =
			`${cwd()}/public/videos/random-short-video-2.mp4.json`.replace(
				"functions",
				""
			);

		// Simulate the video intelligence API by uploading a JSON file with video labels
		await getStorage().bucket(fileBucket).upload(localJSONFile, {
			destination: jsonFilePath,
		});
		/***********
		 * END OF TESTING CODE
		 * *********/
	}
	logger.info(
		`${functionName} Finished: Video document created in Firestore`
	);
});
