import "@/src/app/styles.css";

import Header from "@/components/Header.jsx";
import getUser from "@/lib/getUser.js";

// Force next.js to treat this route as server-side rendered
export const dynamic = "force-dynamic";

export const metadata = {
	title: "Video Hint",
	description: "Video descriptions with the Cloud Video Intelligence API",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Header initialUser={getUser()} />
				{children}
			</body>
		</html>
	);
}
