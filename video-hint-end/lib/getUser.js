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

import { cookies } from "next/headers";

// This is used from next.js server components
// it helps us get the user from the session cookie
// This means on initial load of the page, we can display
// user information without having to wait for the client side JS
// Note: this code does not factor in security best practices

export default function getUser() {
	const cookieStore = cookies();
	const userCookie = cookieStore.get("CODELAB_VIDEO_HINT_USER");

	if (userCookie?.value) {
		try {
			return JSON.parse(userCookie.value);
		} catch (err) {
			console.log(`Error parsing user cookie`, err);
		}
	}
}
