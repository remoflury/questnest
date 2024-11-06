<script lang="ts">
	import { cn } from '$lib/utils/utils';
	import type { Snippet } from 'svelte';

	let {
		text,
		tag = 'h2',
		classes = '',
		icon
	}: {
		text: Snippet;
		tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
		classes?: string;
		icon?: Snippet;
	} = $props();
</script>

<svelte:element
	this={tag}
	class={cn(classes, {
		'flex items-center justify-between gap-x-4': icon
	})}
>
	{@render text()}
	{@render icon?.()}
</svelte:element>
