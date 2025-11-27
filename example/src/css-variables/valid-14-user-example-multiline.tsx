/**
 * ✅ Valid: User example from issue - multiline
 * @validClasses [[--card-bg:#1e293b], [--card-radius:16px], bg-[var(--card-bg)], rounded-[var(--card-radius)], p-4]
 */
export function UserExampleMultiline() {
	return (
		<div
			className="
				[--card-bg:#1e293b]
				[--card-radius:16px]
				bg-[var(--card-bg)]
				rounded-[var(--card-radius)]
				p-4
			">
			User example multiline
		</div>
	);
}
