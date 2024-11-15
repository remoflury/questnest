import { sineInOut } from 'svelte/easing';

export const TRANSITION_CONFIG = {
	duration: 125,
	easing: sineInOut
} as const;

export const QUESTS_PER_BOARD = 24;

// File constants
export const MAX_IMG_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;