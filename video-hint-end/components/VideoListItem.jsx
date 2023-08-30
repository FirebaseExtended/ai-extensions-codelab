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
