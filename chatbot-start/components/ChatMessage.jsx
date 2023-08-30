export default function ChatMessage({ message, className, time }) {
	return (
		<>
			{message && (
				<li className={className}>
					{message}
					<time>({time})</time>
				</li>
			)}
		</>
	);
}
