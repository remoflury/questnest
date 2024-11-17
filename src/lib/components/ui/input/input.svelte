<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils/utils';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: WithElementRef<HTMLInputAttributes> = $props();

	let maxLengthRef: HTMLSpanElement | undefined = $state();
</script>

<div class="relative">
	<input
		bind:this={ref}
		class={cn(
			'flex h-10 w-full rounded-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		bind:value
		style="padding-right: {maxLengthRef ? maxLengthRef.clientWidth + 20 : 20}px"
		{...restProps}
	/>
	{#if restProps.maxlength}
		<span
			class="absolute right-4 top-1/2 -translate-y-1/2 text-xs transition"
			class:text-gray-400={value.length <= restProps.maxlength}
			class:text-destructive={value.length > restProps.maxlength}
			bind:this={maxLengthRef}
		>
			{value.length} / {restProps.maxlength}
		</span>
	{/if}
</div>
