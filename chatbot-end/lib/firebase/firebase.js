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
import { getAuth, connectAuthEmulator, signInWithCustomToken } from "firebase/auth";
import { getApps } from "firebase/app";


export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Next.js exposes this env var on both the server-side and client-side.
const IS_TEST_MODE = process.env.NEXT_PUBLIC_IS_TEST_MODE === "true";

// For development purposes only
// if (IS_TEST_MODE) {
// 	connectFirestoreEmulator(db, "127.0.0.1", 8080);
// 	connectAuthEmulator(auth, "http://127.0.0.1:9099", {
// 		disableWarnings: true,
// 	});
// }

export async function getAuthenticatedAppForUser(session = null) {


  if (typeof window !== "undefined") {
    // client
    console.log("client: ", firebaseApp);

    return { app: firebaseApp, user: auth.currentUser.toJSON() };
  }

  const { initializeApp: initializeAdminApp, getApps: getAdminApps } = await import("firebase-admin/app");

  const { getAuth: getAdminAuth } = await import("firebase-admin/auth");
  const { credential } = await import("firebase-admin");
  const ADMIN_APP_NAME = "firebase-frameworks";
  const adminApp =
    getAdminApps().find((it) => it.name === ADMIN_APP_NAME) ||
    initializeAdminApp({
      credential: credential.applicationDefault()
    }, ADMIN_APP_NAME);

  const adminAuth = getAdminAuth(adminApp);
  const noSessionReturn = { app: null, currentUser: null };


  if (!session) {
    // if no session cookie was passed, try to get from next/headers for app router
    session = await getAppRouterSession();
    console.log("session", session)
    if (!session) return noSessionReturn;
  }

  const decodedIdToken = await adminAuth.verifySessionCookie(session);

  const app = initializeAuthenticatedApp(decodedIdToken.uid)
	const auth = getAuth(app)
  // handle revoked tokens
  const isRevoked = !(await adminAuth
    .verifySessionCookie(session, true)
    .catch((e) => console.error(e.message)));
  if (isRevoked) return noSessionReturn;
  // authenticate with custom token
  if (auth.currentUser?.uid !== decodedIdToken.uid) {
    // TODO(jamesdaniels) get custom claims
    const customToken = await adminAuth
      .createCustomToken(decodedIdToken.uid)
      .catch((e) => console.error(e.message));

    if (!customToken) return noSessionReturn;
    await signInWithCustomToken(auth, customToken);
  }
  console.log("server: ", app);
  return { app, currentUser: auth.currentUser };
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
