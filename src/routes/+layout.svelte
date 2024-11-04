<script lang="ts">
	import '../css/main.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children, data } = $props();
	let supabase = $state(data.supabase);
	let session = $state(data.session);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
