export default function DiscussionItem({
	discussion: { latestMessage, updatedTime, id },
}) {
	return (
		<>
			<span>{latestMessage || id} </span>
			{updatedTime && <time>({updatedTime})</time>}
		</>
	);
}
