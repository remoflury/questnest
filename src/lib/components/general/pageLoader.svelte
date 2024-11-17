<script lang="ts">
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import { LoaderCircle } from 'lucide-svelte';
	import { scale } from 'svelte/transition';

	let isLoading = $state(false);

	beforeNavigate(async () => {
		isLoading = true;
	});
	afterNavigate(() => (isLoading = false));

	$effect(() => {
		if (browser) document.body.classList.toggle('overflow-hidden', isLoading);
	});
</script>

{#if isLoading}
	<div
		aria-busy="true"
		class="bg--400 pointer-events-none absolute inset-0 z-10 grid place-content-center"
		transition:scale={TRANSITION_CONFIG}
	>
		<LoaderCircle size={48} class="animate-spin stroke-primary stroke-1" />
	</div>
{/if}
