<script lang="ts">
	import { menu, footer } from '$lib/store/store';
	import FooterLoggedOut from '$lib/components/footer/footerLoggedOut.svelte';
	import NavLoggedOut from '$lib/components/navigation/navLoggedOut.svelte';
	import DesignElement from '$lib/components/ui/designElements/designElement.svelte';
	import DevPopUp from '$lib/components/general/devPopUp.svelte';

	let { children } = $props();

	let showDevPopUp = $state(true);
</script>

<NavLoggedOut />
<main style="min-height: calc(100dvh - {$menu.heightNav}px - {$footer.footerHeight}px);">
	{@render children()}
</main>
<FooterLoggedOut />

<DesignElement />

<DevPopUp bind:open={showDevPopUp} />
