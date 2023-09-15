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

import "@/src/app/styles.css";

import Header from "@/components/Header.jsx";
import { getAuthenticatedAppForUser } from "@/lib/firebase/firebase";

// Force next.js to treat this route as server-side rendered
export const dynamic = "force-dynamic";

export const metadata = {
	title: "Video Hint",
	description: "Video descriptions with the Cloud Video Intelligence API",
};

export default async function RootLayout({ children }) {
	const { currentUser } = await getAuthenticatedAppForUser();
	return (
		<html lang="en">
			<body>
			<Header initialUser={currentUser?.toJSON()}/>
				{children}
			</body>
		</html>
	);
}
