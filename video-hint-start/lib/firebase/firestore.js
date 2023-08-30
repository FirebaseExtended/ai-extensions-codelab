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

import {
	collection,
	onSnapshot,
	query,
	getDocs,
	orderBy,
	where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firebase";
import { getDownloadURL } from "@/lib/firebase/storage";

function getVideosQuery(userId) {
	return query(
		collection(db, "bot"),
		where("uid", "==", userId),
		orderBy("timeCreated", "desc")
	);
}

async function handleVideoDoc(doc) {
	const data = doc.data();
	const item = {
		id: doc.id,
		...data,
		videoUrl: await getDownloadURL(data.file),
		timeCreated: data.timeCreated.toDate(),
	};

	if (data.audio) {
		item.audioUrl = await getDownloadURL(data.audio);
	}
	return item;
}

export async function getVideos(userId) {
	if (!userId) {
		return [];
	}

	const q = getVideosQuery(userId);
	const querySnapshot = await getDocs(q);
	const videos = querySnapshot.docs.map(handleVideoDoc);
	return Promise.all(videos);
}

export function getVideosSnapshot(userId, cb) {
	if (!userId) {
		return cb([]);
	}

	const q = getVideosQuery(userId);
	const unsubscribe = onSnapshot(q, async querySnapshot => {
		const results = querySnapshot.docs.map(handleVideoDoc);
		cb(await Promise.all(results));
	});
	return unsubscribe;
}
