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

import mockReviews from "./mock-reviews.js";

import shuffle from "https://esm.sh/lodash.shuffle";
import nunjucks from "https://esm.sh/nunjucks@3.2.4";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import config from "./firebase-config.js";

import {
	getFirestore,
	addDoc,
	collection,
	connectFirestoreEmulator,
	onSnapshot,
	query,
	orderBy,
	serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const app = initializeApp(config);
const db = getFirestore(app);

// Uncomment this line to use the local emulator
// connectFirestoreEmulator(db, "127.0.0.1", 8080);

const DB_COLLECTION_NAME = "bot";

function configureNunjucks() {
	nunjucks.configure("/views", { autoescape: true, noCache: true });
}

function renderReviews(reviews = [], averageReductionPercent, averageRating) {
	const template = nunjucks.render("reviews.html", {
		reviews,
		averageReductionPercent,
		averageRating,
	});
	document.querySelector(".original-reviews").innerHTML = template;
}

function calculateReductionPercent(summary, originalReview) {
	const summaryLength = summary.length;
	const originalReviewLength = originalReview.length;
	const reductionPercent =
		((originalReviewLength - summaryLength) / originalReviewLength) * 100;
	return Math.round(reductionPercent);
}

function monitorReviews() {
	onSnapshot(
		query(collection(db, DB_COLLECTION_NAME), orderBy("timestamp", "desc")),
		snapshot => {
			let totalReductionPercent = 0;
			let totalRating = 0;
			const reviews = snapshot.docs.map(doc => {
				const data = doc.data();
				let review;

				if (data.text) {
					try {
						const parsedJSON = JSON.parse(data.text);
						review = {
							...parsedJSON,
							originalReview: data.originalReview,
							prompt: data.input,
							response: data.text,
							reductionPercent: calculateReductionPercent(
								parsedJSON.summary,
								data.originalReview
							),
						};

						totalReductionPercent += review.reductionPercent;
						totalRating += review.rating;
					} catch (error) {
						console.log(`There was an error parsing the data:`, {
							error,
							data,
							docID: doc.id,
						});
					}
				}

				return review || data;
			});

			const averageReductionPercent = Math.round(
				totalReductionPercent / reviews.length
			);
			const averageRating = Math.round(totalRating / reviews.length);
			renderReviews(reviews, averageReductionPercent, averageRating);
		}
	);
}

function registerButtonEventListeners() {
	document.body.addEventListener("click", async event => {
		const reviews = shuffle(mockReviews).slice(0, 2);

		if (event.target.classList.contains("add-reviews")) {
			for (const review of reviews) {
				const reviewWithPrompt = `Here's a user supplied review. Give me a shorter summary of the review, and a rating out of 5, and a flag which indicates if there was a product defect.

Product name: "Blue t-shirt with cat picture". Review: """${review}"""

Craft your response as JSON with properties has_defect, summary and rating. Don't include any extra text.`;
				await addDoc(collection(db, DB_COLLECTION_NAME), {
					input: reviewWithPrompt,
					originalReview: review,
					timestamp: serverTimestamp(),
				});
			}
		}
	});
}

async function init() {
	configureNunjucks();
	monitorReviews();
	registerButtonEventListeners();
}

export default { init };
