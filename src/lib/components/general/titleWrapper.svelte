<script lang="ts">
	import type { HeadingTypes } from '$lib/types/GeneralTypes';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/utils';
	import { ChevronLeft } from 'lucide-svelte';

	let {
		text,
		tag = 'h2',
		class: className = '',
		icon,
		goBackUri
	}: {
		text: Snippet;
		tag?: HeadingTypes;
		class?: string;
		icon?: Snippet;
		goBackUri?: string;
	} = $props();
</script>

<svelte:element
	this={tag}
	class={cn(className, {
		'flex items-baseline justify-start gap-x-4': goBackUri
	})}
>
	{#if goBackUri}
		<a href={goBackUri} title="go back" aria-label="go back">
			<ChevronLeft class="stroke-primary" />
		</a>
	{/if}
	<span
		class={cn({
			'flex w-full items-center justify-between gap-x-4': icon
		})}
	>
		{@render text()}
		{@render icon?.()}
	</span>
</svelte:element>
