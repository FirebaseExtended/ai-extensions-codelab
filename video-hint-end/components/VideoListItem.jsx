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

// Slightly modified from https://blog.webdevsimplified.com/2020-07/relative-time-format/
const formatter = new Intl.RelativeTimeFormat(undefined, {
	numeric: "auto",
});

const DIVISIONS = [
	{ amount: 60, name: "seconds" },
	{ amount: 60, name: "minutes" },
	{ amount: 24, name: "hours" },
	{ amount: 7, name: "days" },
	{ amount: 4.34524, name: "weeks" },
	{ amount: 12, name: "months" },
	{ amount: Number.POSITIVE_INFINITY, name: "years" },
];

function formatTimeAgo(date) {
	let duration = (date - new Date()) / 1000;

	if (Math.abs(duration) < 60) {
		return "Less than a minute ago";
	}

	for (let i = 0; i < DIVISIONS.length; i++) {
		const division = DIVISIONS[i];
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.name);
		}
		duration /= division.amount;
	}
}

export default function VideoListItem({ video }) {
	return (
		<>
			<details>
				<summary>{video.text || "Please wait..."}</summary>
				Original prompt text:
				<pre>
					<code>{video.input || "Please wait..."}</code>
				</pre>
			</details>
			<video
				controls
				src={video.videoUrl}
				className="video__player"
				muted
			></video>

			{video.audioUrl && <audio controls src={video.audioUrl}></audio>}

			{video.timeCreated && (
				<time>{formatTimeAgo(new Date(video.timeCreated))}</time>
			)}
		</>
	);
}
