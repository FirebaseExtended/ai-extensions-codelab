import DiscussionListItem from "./DiscussionListItem";
import Link from "next/link";

export default function Discussions({ discussions, currentDiscussionId }) {
	return (
		<>
			<ul className="discussions-list">
				{discussions.map(discussion => {
					const isCurrent = currentDiscussionId === discussion.id;
					const listItem = (
						<DiscussionListItem
							discussion={discussion}
							isCurrent={isCurrent}
						/>
					);

					return (
						<li key={discussion.id}>
							{isCurrent ? (
								listItem
							) : (
								<Link href={`/discussion/${discussion.id}`}>
									{listItem}
								</Link>
							)}
						</li>
					);
				})}
			</ul>
		</>
	);
}
