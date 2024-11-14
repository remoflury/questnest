<script lang="ts">
	import { menu } from '$lib/store/store';
	import NavLoggedIn from '$lib/components/navigation/navLoggedIn.svelte';

	let { children } = $props();
</script>

<main class="min-h-dvh" style="padding-bottom: {$menu.heightAppNav}px">
	{@render children()}
</main>
<NavLoggedIn />
