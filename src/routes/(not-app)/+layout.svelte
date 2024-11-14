<script lang="ts">
	import { menu, footer } from '$lib/store/store';
	import FooterLoggedOut from '$lib/components/footer/footerLoggedOut.svelte';
	import NavLoggedOut from '$lib/components/navigation/navLoggedOut.svelte';

	let { children } = $props();
</script>

<NavLoggedOut />
<main style="min-height: calc(100dvh - {$menu.heightNav}px - {$footer.footerHeight}px);">
	{@render children()}
</main>
<FooterLoggedOut />
