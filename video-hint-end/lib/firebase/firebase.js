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

import firebaseConfig from "@/lib/firebase/firebase-config.js";
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator, signInWithCustomToken } from "firebase/auth";
import { getApps } from "firebase/app";

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Next.js exposes this env var on both the server-side and client-side.
const IS_TEST_MODE = process.env.NEXT_PUBLIC_IS_TEST_MODE === "true";

if (IS_TEST_MODE) {
	connectFirestoreEmulator(db, "127.0.0.1", 8080);
	connectStorageEmulator(storage, "127.0.0.1", 9199);
	connectAuthEmulator(auth, "http://127.0.0.1:9099", {
		disableWarnings: true,
	});
}


export async function getAuthenticatedAppForUser(session = null) {
	if (typeof window !== "undefined") {
	  // client
	  console.log("client: ", firebaseApp);
  
	  return { app: firebaseApp, user: auth.currentUser };
	}
	const { initializeApp: initializeAdminApp, getApps: getAdminApps } = await import("firebase-admin/app");
	
	const { credential } = await import("firebase-admin");
	const { getAuth: getAdminAuth } = await import("firebase-admin/auth");
  
	const ADMIN_APP_NAME = "firebase-app";
  
	const adminApp =
	  getAdminApps().find((it) => it.name === ADMIN_APP_NAME) ||
	  initializeAdminApp(
		{
		  credential: credential.cert({
			clientEmail: process.env._FIREBASE_ADMIN_CLIENT_EMAIL,
			privateKey: process.env._FIREBASE_ADMIN_PRIVATE_KEY,
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		  }),
		},
		ADMIN_APP_NAME
	  );
  
	const adminAuth = getAdminAuth(adminApp);
  
	const noSessionReturn = { app: null, currentUser: null };
  
	if (!session) {
	  // if no session cookie was passed, try to get from next/headers for app router
	  session = await getAppRouterSession();
	  if (!session) return noSessionReturn;
	}
  
	const decodedIdToken = await adminAuth.verifySessionCookie(session);
  
	// handle revoked tokens
	const isRevoked = !(await adminAuth
	  .verifySessionCookie(session, true)
	  .catch((e) => console.error(e.message)));
	if (isRevoked) return noSessionReturn;
  
	const authenticatedApp = initializeAuthenticatedApp(decodedIdToken.uid);
	const auth = getAuth(authenticatedApp);
  
	// authenticate with custom token
	if (auth.currentUser?.uid !== decodedIdToken.uid) {
	  // TODO(jamesdaniels) get custom claims
	  const customToken = await adminAuth
		.createCustomToken(decodedIdToken.uid)
		.catch((e) => console.error(e.message));
  
	  if (!customToken) return noSessionReturn;
  
	  await signInWithCustomToken(auth, customToken);
	}
  
	return { authenticatedApp, currentUser: auth.currentUser };
  }
  
  async function getAppRouterSession() {
	// dynamically import to prevent import errors in pages router
	const { cookies } = await import("next/headers");
  
	try {
	  return cookies().get("__session")?.value;
	} catch (error) {
	  // cookies() throws when called from pages router
	  return undefined;
	}
  }
  
  function initializeAuthenticatedApp(uid) {
	const random = Math.random().toString(36).split(".")[1];
	const appName = `authenticated-context:${uid}:${random}`;
  
	const app = initializeApp(firebaseConfig, appName);
  
	return app;
  }
