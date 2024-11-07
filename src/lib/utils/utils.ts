import type { ApiResponse, HttpStatus } from '$lib/types/GeneralTypes';
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
