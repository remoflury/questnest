<script lang="ts">
	import type { HeadingTypes } from '$lib/types/GeneralTypes';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/utils';

	let {
		text,
		tag = 'h2',
		className = '',
		icon
	}: {
		text: Snippet;
		tag?: HeadingTypes;
		className?: string;
		icon?: Snippet;
	} = $props();
</script>

<svelte:element
	this={tag}
	class={cn(className, {
		'flex items-center justify-between gap-x-4': icon
	})}
>
	{@render text()}
	{@render icon?.()}
</svelte:element>
