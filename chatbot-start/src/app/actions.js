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

"use server";

import { addNewMessage } from "@/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/lib/firebase/firebase";
import { getFirestore } from "firebase/firestore";
import { redirect } from "next/navigation";

export async function handleNewMessage(data) {
	const { app } = await getAuthenticatedAppForUser();
	const db = getFirestore(app);
	const originalDiscussionId = data.get("discussionId");
	const newDiscussionId = await addNewMessage({
		db,
		userId: data.get("userId"),
		discussionId: originalDiscussionId,
		message: data.get("new-message"),
	});

	if (originalDiscussionId === "new") {
		redirect(`/discussion/${newDiscussionId}`, "replace");
	}
}
