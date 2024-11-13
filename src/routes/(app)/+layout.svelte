<script lang="ts">
	import NavLoggedIn from '$lib/components/navigation/navLoggedIn.svelte';

	let { children } = $props();
</script>

{@render children()}
<NavLoggedIn />
