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

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
	signInWithGoogle,
	signOut,
	onAuthStateChanged,
} from "@/lib/firebase/auth.js";
import { useRouter } from "next/navigation";

// If the user logs in on the client, we send the user data to the server
// Sending a user payload to this endpoint will create a persistent cookie
async function handleUserSession(user = {}) {
	return fetch("/api", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	});
}

function useUserSession(initialUser) {
	// The initialUser comes from the server via a server component
	const [user, setUser] = useState(initialUser);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(async user => {
			if (user) {
				setUser(user);

				// A more resillient approach would be to send the Firebase auth token to the server, and have the server verify the token with firebase-admin, however this approach of sending just the user data we need is simpler and works for this demo
				await handleUserSession({
					email: user.email,
					id: user.uid,
					displayName: user.displayName,
				});
			} else {
				setUser(null);
				await handleUserSession();
			}
		});
		return () => {
			unsubscribe();
		};
	}, []);
	return user;
}

export default function Header({ initialUser }) {
	const user = useUserSession(initialUser);
	const router = useRouter();
	const handleSignOut = event => {
		event.preventDefault();
		signOut();
		router.push("/");
		router.refresh();
	};

	const handleSignIn = event => {
		event.preventDefault();
		signInWithGoogle();
	};

	return (
		<header>
			<Link href="/" className="logo">
				Chatbot
			</Link>
			{user ? (
				<>
					<div className="profile">
						<p>
							<img src="/profile.svg" alt={user.email} />
							{user.displayName}
						</p>

						<div className="menu">
							...
							<ul>
								<li>{user.displayName}</li>

								<li>
									<a href="#" onClick={handleSignOut}>
										Sign Out
									</a>
								</li>
							</ul>
						</div>
					</div>
				</>
			) : (
				<a href="#" onClick={handleSignIn}>
					Sign In with Google
				</a>
			)}
		</header>
	);
}
