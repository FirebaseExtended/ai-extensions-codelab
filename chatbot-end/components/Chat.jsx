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

"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { useRouter } from "next/navigation";

import Discussions from "./Discussions";
import ChatMessage from "./ChatMessage";

import { handleNewMessage } from "@/src/app/actions.js";
import {
	subscribeToMessages,
	subscribeToDiscussions,
} from "@/lib/firebase/firestore.js";
import { onAuthStateChanged } from "@/lib/firebase/auth.js";

export default function Chat({
	initialDiscussions,
	initialDiscussionId,
	initialMessages,
	initialUserId,
}) {
	const router = useRouter();
	const [state, setState] = useState({
		newMessage: "",
		// These values come from the server, and are used to initialize the state
		discussions: initialDiscussions,
		currentDiscussionId: initialDiscussionId,
		userId: initialUserId || "",
		messages: initialMessages,
	});

	const ref = useRef(null);

	const scrollToLastMessage = () => {
		const lastChildElement = ref.current?.lastElementChild;
		lastChildElement?.scrollIntoView({ behavior: "smooth" });
	};

	const handleNewChat = () => {
		setState(prevState => ({
			...prevState,
			messages: [],
			newMessage: "",
			currentDiscussionId: "new",
		}));
		router.push(`/discussion/new`);
		router.refresh();
	};

	useEffect(() => {
		scrollToLastMessage();
	}, [state.messages]);

	useEffect(() => {
		if (!state.userId) {
			return;
		}

		const unsubscribeFromDiscussions = subscribeToDiscussions(
			state.userId,
			data => {
				if (state.currentDiscussionId === "new") {
					data = [
						{
							id: "new",
						},
						...data,
					];
				}
				setState(prevState => ({
					...prevState,
					discussions: data,
				}));
			}
		);

		const unsubscribeFromMessages = subscribeToMessages(
			state.userId,
			state.currentDiscussionId,
			data => {
				setState(prevState => ({
					...prevState,
					messages: data,
				}));
			}
		);

		return () => {
			unsubscribeFromMessages();
			unsubscribeFromDiscussions();
		};
	}, [state.userId, state.currentDiscussionId]);

	if (!state.userId) {
		return <p>Please log in</p>;
	}

	return (
		<div className="container">
			<aside>
				<div className="title">
					<h2>Discussions</h2>
					<button onClick={handleNewChat}>New chat</button>
				</div>

				<Discussions
					currentDiscussionId={state.currentDiscussionId}
					discussions={state.discussions}
				/>
			</aside>

			<section className="messages-container">
				<ul className="messages-list" ref={ref}>
					{state.messages.map(message => (
						<Fragment key={message.id}>
							<ChatMessage
								message={message.prompt}
								className="messages--mine"
								time={message.createTime}
							/>
							<ChatMessage
								message={message.response}
								className="messages--theirs"
								time={message?.completeTime}
							/>
						</Fragment>
					))}
				</ul>

				<form
					action={handleNewMessage}
					onSubmit={() => {
						setState(prevState => ({
							...prevState,
							newMessage: "",
						}));
					}}
				>
					<input
						autoComplete="off"
						type="new-message"
						name="new-message"
						id="new-message"
						placeholder="Enter your message"
						required
						value={state.newMessage}
						onChange={e => {
							setState(prevState => ({
								...prevState,
								newMessage: e.target.value,
							}));
						}}
					/>
					<input
						type="hidden"
						name="discussionId"
						value={state.currentDiscussionId}
					/>
					<input type="hidden" name="userId" value={state.userId} />
					<button type="submit" value="confirm">
						Send
					</button>
				</form>
			</section>
		</div>
	);
}
