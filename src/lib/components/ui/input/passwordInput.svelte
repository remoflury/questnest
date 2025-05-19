<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils/utils';
	import { Eye, EyeClosed } from 'lucide-svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: WithElementRef<HTMLInputAttributes> = $props();

	let type: 'password' | 'text' = $state('password');
	let isHidden = $derived(type == 'password');
	const toggle = () => {
		if (type == 'password') {
			type = 'text';
		} else {
			type = 'password';
		}
	};
</script>

<div class="relative">
	<input
		bind:this={ref}
		class={cn(
			'flex h-10 w-full rounded-full border border-input bg-background py-2 pl-3 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		bind:value
		{...restProps}
		{type}
	/>
	<button
		type="button"
		class="absolute right-3 top-1/2 -translate-y-1/2"
		aria-label="{isHidden ? 'show' : 'hide'} password"
		title={isHidden ? 'show' : 'hide'}
		onclick={toggle}
	>
		{#if isHidden}
			<Eye class="stroke-secondary" size={20} />
		{:else}
			<EyeClosed class="stroke-secondary" size={20} />
		{/if}
	</button>
</div>
