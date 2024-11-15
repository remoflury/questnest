<script lang="ts">
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/utils';
	import { convertBlobToCustomFileClientSide } from '$lib/utils/fileUtils';
	import { scale } from 'svelte/transition';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import { Trash2 } from 'lucide-svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		accept,
		nameReplace,
		class: className,
		...restProps
	}: WithElementRef<HTMLInputAttributes> & { nameReplace?: string } = $props();

	async function handleFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.files?.length) return;

		const blob = new Blob([target.files[0]], { type: target.files[0].type });

		const customFile = await convertBlobToCustomFileClientSide(
			blob,
			target.files[0].name,
			blob.type
		);

		value = customFile;
	}
</script>

<div class="flex gap-x-4">
	<button
		aria-label="Select file"
		type="button"
		class={cn(
			'flex h-10 w-full max-w-max items-center truncate rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-secondary file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		onclick={() => ref?.click()}
	>
		{#if value}
			{nameReplace ? value.name.replace(`${nameReplace}/`, '') : value.name}
		{:else}
			Select file
		{/if}
	</button>

	{#if value?.name}
		<button
			type="button"
			transition:scale={TRANSITION_CONFIG}
			aria-label="Datei entfernen"
			onclick={() => (value = undefined)}><Trash2 size="16" /></button
		>
	{/if}
</div>
<input bind:this={ref} type="file" oninput={handleFileInput} hidden {accept} {...restProps} />
