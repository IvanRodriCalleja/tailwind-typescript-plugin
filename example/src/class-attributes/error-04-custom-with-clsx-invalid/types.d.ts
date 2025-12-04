import 'react';

declare module 'react' {
	interface HTMLAttributes<T> {
		customStyles?: string;
	}
}
