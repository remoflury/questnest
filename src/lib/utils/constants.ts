import { sineInOut } from 'svelte/easing';

export const TRANSITION_CONFIG = {
	duration: 250,
	easing: sineInOut
} as const;

export const QUESTS_PER_BOARD = 24