import {
	ref,
	uploadBytesResumable,
	getDownloadURL as _getDownloadURL,
} from "firebase/storage";

import { storage } from "@/lib/firebase/firebase";

export function uploadVideo(userId, filePath, file) {
	const storageRef = ref(storage, `video_annotation_input/${filePath}`);

	const uploadTask = uploadBytesResumable(storageRef, file, {
		customMetadata: {
			uid: userId,
		},
	});

	return uploadTask;
}

export async function getDownloadURL(file) {
	const storageRef = ref(storage, file);
	const url = await _getDownloadURL(storageRef);
	return url;
}
