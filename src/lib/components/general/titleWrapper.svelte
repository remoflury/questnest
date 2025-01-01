<script lang="ts">
	import type { HeadingTypes } from '$lib/types/GeneralTypes';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/utils';
	import { ChevronLeft } from 'lucide-svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLHeadingElement> & {
		text: Snippet;
		tag?: HeadingTypes;
		class?: string;
		icon?: Snippet;
		goBackUri?: string;
	};
	let { text, tag = 'h2', class: className = '', icon, goBackUri, ...restProps }: Props = $props();
</script>

<svelte:element
	this={tag}
	class={cn(className, {
		'flex items-baseline justify-start gap-x-4': goBackUri
	})}
	{...restProps}
>
	{#if goBackUri}
		<a href={goBackUri} title="go back" aria-label="go back">
			<ChevronLeft class="stroke-primary dark:stroke-foreground" />
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
