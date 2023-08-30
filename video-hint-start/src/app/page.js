import getUser from "@/lib/getUser.js";
import { getVideos } from "@/lib/firebase/firestore.js";
import Main from "@/components/Main";

export const dynamic = "force-dynamic";

export default async function Discussion() {
	const user = getUser();
	const videos = await getVideos(user?.id);

	return (
		<main>
			<Main initialVideos={videos} initialUser={user} />
		</main>
	);
}
