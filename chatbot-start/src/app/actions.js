"use server";

import { addNewMessage } from "@/lib/firebase/firestore.js";
import { redirect } from "next/navigation";

export async function handleNewMessage(data) {
	const originalDiscussionId = data.get("discussionId");
	const newDiscussionId = await addNewMessage({
		userId: data.get("userId"),
		discussionId: originalDiscussionId,
		message: data.get("new-message"),
	});

	if (originalDiscussionId === "new") {
		redirect(`/discussion/${newDiscussionId}`, "replace");
	}
}
