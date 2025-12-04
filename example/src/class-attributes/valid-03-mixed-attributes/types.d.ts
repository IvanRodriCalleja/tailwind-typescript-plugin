import 'react';

declare module 'react' {
	interface HTMLAttributes<T> {
		customClass?: string;
	}
}
