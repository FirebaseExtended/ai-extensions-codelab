import firebaseConfig from "@/lib/firebase/firebase-config.js";
import { initializeApp } from "firebase/app";

import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import { getAuth, connectAuthEmulator } from "firebase/auth";

import { getApps } from "firebase/app";

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

// Next.js exposes this env var on both the server-side and client-side.
const IS_TEST_MODE = process.env.NEXT_PUBLIC_IS_TEST_MODE === "true";

if (IS_TEST_MODE) {
	connectFirestoreEmulator(db, "127.0.0.1", 8080);
	connectAuthEmulator(auth, "http://127.0.0.1:9099", {
		disableWarnings: true,
	});
}
