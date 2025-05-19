import { writable } from 'svelte/store';

export const menu = writable({
	heightAppNav: 0,
	heightNav: 0
});

export const footer = writable({
	footerHeight: 0
});
