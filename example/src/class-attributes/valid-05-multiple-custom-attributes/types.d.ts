import 'react';

declare module 'react' {
	interface HTMLAttributes<T> {
		containerStyles?: string;
		textStyles?: string;
		bgStyles?: string;
	}
}
