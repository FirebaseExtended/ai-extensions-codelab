import VideoListItem from "./VideoListItem";

export default function Videos({ videos }) {
	return (
		<>
			<ul className="videos-list">
				{videos.map(video => (
					<li key={video.id}>
						<VideoListItem video={video} />
					</li>
				))}
			</ul>
		</>
	);
}
