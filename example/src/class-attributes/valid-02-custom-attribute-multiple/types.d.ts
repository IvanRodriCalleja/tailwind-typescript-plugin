import 'react';

declare module 'react' {
	interface HTMLAttributes<T> {
		textStyles?: string;
	}
}
