import type { HttpStatus } from '$lib/types/GeneralTypes';

import { json } from '@sveltejs/kit';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const genApiRes = <T>(payload?: T, message?: string, status: HttpStatus = 200) => {
	return json(
		{
			payload,
			message,
			status
		},
		{
			status
		}
	);
};

// eslint-disable-next-line
export const debounce = (callback: (...args: any[]) => void, wait = 300) => {
	let timeout: ReturnType<typeof setTimeout>;

	// eslint-disable-next-line
	return (...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), wait);
	};
};
