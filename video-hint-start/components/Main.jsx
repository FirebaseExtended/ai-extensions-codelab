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

import Videos from "./Videos";

import { Fragment, useState, useEffect, useRef } from "react";
import { getVideosSnapshot } from "@/lib/firebase/firestore.js";
import { uploadVideo } from "@/lib/firebase/storage.js";
import { onAuthStateChanged } from "@/lib/firebase/auth.js";
import exampleVideos from "@/lib/exampleVideos.js";
import { useRouter } from "next/navigation";

function getFileExtension(filename) {
	const parts = filename.split(".");
	const fileExtension = parts.length > 1 ? parts.pop() : "";
	return fileExtension;
}

async function handleExampleVideo({
	userId,
	video,
	setUploadProgress,
	setUploading,
}) {
	const fileExtension = getFileExtension(video.url);
	const response = await fetch(video.url);
	const file = await response.arrayBuffer();

	const filePath = `${crypto.randomUUID()}.${fileExtension}`;
	const uploadTask = uploadVideo(userId, filePath, file);
	setUploading(true);

	uploadTask.on(
		"state_changed",
		snapshot => {
			const progress = Math.round(
				(snapshot.bytesTransferred / snapshot.totalBytes) * 100
			);
			setUploadProgress(progress);
		},
		error => {
			console.log(`Error uploading video:`, error);
			setUploading(false);
		},
		() => {
			setUploadProgress(0);
			setUploading(false);
		}
	);
}
function useUserSession(initialUserId) {
	// The initialUser comes from the server via a server component
	const [userId, setUserId] = useState(initialUserId);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(authUser => {
			setUserId(authUser ? authUser.uid : "");
		});

		return () => unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		onAuthStateChanged(authUser => {
			if (userId === undefined) return "";

			// refresh when user changed to ease testing
			if (userId !== authUser?.uid) {
				router.refresh();
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

	return userId;
}

export default function Main({ initialVideos, initialUserId }) {
	const [uploadProgress, setUploadProgress] = useState(
		new Array(exampleVideos.length).fill(0)
	);

	const [uploading, setUploading] = useState(false);

	const [videos, setVideos] = useState(initialVideos);
	const [userId, setUserId] = useState(initialUserId || "");

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(user => {
			if (user) {
				setUserId(user.uid);
			} else {
				setUserId("");
			}
		});
		return () => {
			unsubscribe();
		};
	}, []);
	useEffect(() => {
		if (!userId) {
			return;
		}

		const unsubscribeFromVideosSnapshot = getVideosSnapshot(
			null,
			userId,
			data => {
				setVideos(data);
			}
		);

		return () => {
			unsubscribeFromVideosSnapshot();
		};
	}, [userId]);

	if (!userId) {
		return <p>Please log in</p>;
	}

	return (
		<div className="container">
			<h2>Upload a video</h2>

			<div className="example-videos-buttons">
				{exampleVideos.map((video, index) => (
					<div key={video.id}>
						<button
							disabled={uploading}
							onClick={() => {
								handleExampleVideo({
									userId,
									video,
									setUploadProgress: progress => {
										const updatedProgress = [
											...uploadProgress,
										];
										updatedProgress[index] = progress;
										setUploadProgress(updatedProgress);
									},
									setUploading,
								});
							}}
						>
							{uploadProgress[index] === 0
								? `Upload ${video.title}`
								: `Uploading ${uploadProgress[index]}%`}
						</button>

						<span className="video-button-credits">
							Credit:{" "}
							<a href={video.credit.url} target="_blank">
								{video.credit.text}
							</a>
						</span>
					</div>
				))}
			</div>
			<h2>Processed videos ({videos.length}) </h2>

			<Videos videos={videos} />
		</div>
	);
}
