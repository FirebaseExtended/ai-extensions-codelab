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

function getDiscussionsQuery(userId) {
	if (!userId) {
		return null;
	}
	const discussionsRef = collection(db, "users", userId, "discussions");
	return query(discussionsRef, orderBy("updatedTime", "desc"));
}

async function getDiscussions(userId) {
	if (!userId) {
		return [];
	}
	const q = getDiscussionsQuery(userId);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map(formatDiscussionDoc);
}

function subscribeToDiscussions(userId, callback) {
	if (!userId) {
		return;
	}

	const q = getDiscussionsQuery(userId);

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
function getMessagesQuery(userId, discussionId) {
	return {};
}
// Replace the getMessagesQuery() function above ⬆️

// Replace the handleMessageDoc() function below ⬇️
function handleMessageDoc(doc) {
	return {};
}
// Replace the handleMessageDoc() function above ⬆️

async function getMessages(userId, discussionId) {
	if (!userId || !discussionId) {
		return [];
	}

	const q = getMessagesQuery(userId, discussionId);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map(handleMessageDoc);
}

function subscribeToMessages(userId, discussionId, callback) {
	if (!userId || !discussionId) {
		return;
	}

	const q = getMessagesQuery(userId, discussionId);

	const unsubscribe = onSnapshot(q, querySnapshot => {
		const messages = querySnapshot.docs.map(handleMessageDoc);
		callback(messages);
	});

	return unsubscribe;
}

async function addNewMessage({ userId, discussionId, message }) {
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
			collection(db, "users", userId, "discussions"),
			{
				updatedTime: serverTimestamp(),
				latestMessage: message,
			}
		);

		discussionId = newDiscussionRef.id;
	}

	// Insert your code below ⬇️
	// Insert your code above ⬆️

	// Don't change the code below
	return discussionId;
}

export {
	getDiscussions,
	subscribeToDiscussions,
	getMessages,
	subscribeToMessages,
	addNewMessage,
};
