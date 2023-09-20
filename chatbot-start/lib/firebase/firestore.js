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
	doc,
	updateDoc,
	orderBy,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

function formatDate(date) {
	return date.toLocaleTimeString("en-US");
}

function formatDiscussionDoc(doc) {
	const data = doc.data();
	return {
		id: doc.id,
		latestMessage: data.latestMessage,
		updatedTime: formatDate(data.updatedTime.toDate()),
	};
}

function getDiscussionsQuery(db, userId) {
	if (!userId) {
		return null;
	}
	const discussionsRef = collection(db, "users", userId, "discussion");
	return query(discussionsRef, orderBy("updatedTime", "desc"));
}

async function getDiscussions(db, userId) {
	if (!userId) {
		return [];
	}
	const q = getDiscussionsQuery(db, userId);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map(formatDiscussionDoc);
}

function subscribeToDiscussions(userId, callback) {
	if (!userId) {
		return;
	}

	const q = getDiscussionsQuery(db, userId);

	const unsubscribe = onSnapshot(q, querySnapshot => {
		const discussions = querySnapshot.docs.map(formatDiscussionDoc);
		if (typeof callback !== "function") {
			return;
		}

		callback(discussions);
	});

	return unsubscribe;
}

// Replace the getMessagesQuery() function below ⬇️
function getMessagesQuery(db, userId, discussionId) {
	return {};
}
// Replace the getMessagesQuery() function above ⬆️

// Replace the handleMessageDoc() function below ⬇️
function handleMessageDoc(doc) {
	return {};
}
// Replace the handleMessageDoc() function above ⬆️

async function getMessages(db, userId, discussionId) {
	if (!userId || !discussionId) {
		return [];
	}

	const q = getMessagesQuery(db, userId, discussionId);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map(handleMessageDoc);
}

function subscribeToMessages(userId, discussionId, callback) {
	if (!userId || !discussionId) {
		return;
	}

	const q = getMessagesQuery(db, userId, discussionId);

	const unsubscribe = onSnapshot(q, querySnapshot => {
		const messages = querySnapshot.docs.map(handleMessageDoc);
		callback(messages);
	});

	return unsubscribe;
}

async function addNewMessage({ db, userId, discussionId, message }) {
	if (!userId) {
		throw new Error("userId is required");
	}
	if (!discussionId) {
		throw new Error("discussionId is required");
	}
	if (!message?.length) {
		throw new Error("message is required");
	}

	if (discussionId === "new") {
		const newDiscussionRef = await addDoc(
			collection(db, "users", userId, "discussion"),
			{
				updatedTime: serverTimestamp(),
				latestMessage: message,
			}
		);

		discussionId = newDiscussionRef.id;
	}

	// Insert your code below ⬇️
	// Insert your code above ⬆️
	return discussionId;
}

export {
	getDiscussions,
	subscribeToDiscussions,
	getMessages,
	subscribeToMessages,
	addNewMessage,
};
