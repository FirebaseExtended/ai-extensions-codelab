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

import { db, storage } from "@/lib/firebase/firebase";
import { getDownloadURL } from "@/lib/firebase/storage";

function getVideosQuery(authenticatedDb=null, userId) {
	return query(
		collection(authenticatedDb ?? db, "bot"),
		where("uid", "==", userId),
		orderBy("timeCreated", "desc")
	);
}

async function handleVideoDoc(storage, doc) {
	const data = doc.data();
	const item = {
		id: doc.id,
		...data,
		videoUrl: await getDownloadURL(storage, data.file),
		timeCreated: data.timeCreated.toDate(),
	};

	if (data.audio) {
		item.audioUrl = await getDownloadURL(storage, data.audio);
	}
	return item;
}

export async function getVideos(authenticatedDb=null, storage, userId) {
	if (!userId) {
		return [];
	}

	const q = getVideosQuery(authenticatedDb ?? db, userId);
	const querySnapshot = await getDocs(q);
	const videos = querySnapshot.docs.map(doc => handleVideoDoc(storage, doc));
	return Promise.all(videos);
}

export function getVideosSnapshot(authenticatedDb=null, userId, cb) {
	if (!userId) {
		return cb([]);
	}

	const q = getVideosQuery(authenticatedDb ?? db, userId);
	const unsubscribe = onSnapshot(q, async querySnapshot => {
		const results = querySnapshot.docs.map((doc => handleVideoDoc(storage, doc)));
		cb(await Promise.all(results));
	});
	return unsubscribe;
}
