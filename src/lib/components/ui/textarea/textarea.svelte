<script lang="ts">
	import type { WithElementRef, WithoutChildren } from 'bits-ui';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();

	let maxLengthRef: HTMLSpanElement | undefined = $state();
</script>

<div class="relative">
	<textarea
		bind:this={ref}
		class={cn(
			'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		bind:value
		{...restProps}
	>
	</textarea>
	{#if restProps.maxlength && typeof value != 'number' && value}
		<span
			class="absolute bottom-2 right-4 text-xs transition"
			class:text-gray-400={value.length <= restProps.maxlength}
			class:text-destructive={value.length > restProps.maxlength}
			bind:this={maxLengthRef}
		>
			{value?.length} / {restProps.maxlength}
		</span>
	{/if}
</div>
