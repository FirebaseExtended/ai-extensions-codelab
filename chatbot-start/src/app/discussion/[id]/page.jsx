import getUser from "@/lib/getUser.js";
import { getDiscussions, getMessages } from "@/lib/firebase/firestore.js";
import Chat from "@/components/Chat";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Discussion({ params }) {
	const user = getUser();
	let discussions = await getDiscussions(user?.id);
	const messages = await getMessages(user?.id, params.id);

	if (params.id === "new") {
		discussions = [
			{
				id: "new",
			},
			...discussions,
		];
	} else if (!messages.length) {
		return redirect(`/`);
	}

	return (
		<main>
			<Chat
				initialDiscussions={discussions}
				initialDiscussionId={params.id}
				initialMessages={messages}
				initialUser={user}
			/>
		</main>
	);
}
