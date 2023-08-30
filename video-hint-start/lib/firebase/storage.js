import {
	ref,
	uploadBytesResumable,
	getDownloadURL as _getDownloadURL,
} from "firebase/storage";

import { storage } from "@/lib/firebase/firebase";

export function uploadVideo(userId, filePath, file) {
	// Update the code below
	// Update the code above ☝️
}

export async function getDownloadURL(file) {
	const storageRef = ref(storage, file);
	const url = await _getDownloadURL(storageRef);
	return url;
}
