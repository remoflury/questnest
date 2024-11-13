<script lang="ts">
	import NavLoggedOut from '$lib/components/navigation/navLoggedOut.svelte';

	let { children } = $props();
</script>

<NavLoggedOut />
{@render children()}
