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

function getMessagesQuery(userId, discussionId) {
	if (!userId || !discussionId) {
		return null;
	}
	const messagesRef = collection(
		db,
		"users",
		userId,
		"discussions",
		discussionId,
		"messages"
	);
	return query(messagesRef, orderBy("createTime", "asc"));
}

function handleMessageDoc(doc) {
	const data = doc.data();
	const item = {
		prompt: data.prompt,
		response: data.response,
		id: doc.id,
		createTime: formatDate(data.createTime.toDate()),
	};

	if (data?.status?.completeTime) {
		item.completeTime = formatDate(data.status.completeTime.toDate());
	}

	return item;
}

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

	await addDoc(
		collection(
			db,
			"users",
			userId,
			"discussions",
			discussionId,
			"messages"
		),
		{
			prompt: message,
			createTime: serverTimestamp(),
		}
	);

	await updateDoc(doc(db, "users", userId, "discussions", discussionId), {
		latestMessage: message,
		updatedTime: serverTimestamp(),
	});

	return discussionId;
}

export {
	getDiscussions,
	subscribeToDiscussions,
	getMessages,
	subscribeToMessages,
	addNewMessage,
};
