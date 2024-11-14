<script lang="ts">
	import '../css/main.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import DesignElement from '$lib/components/ui/designElements/designElement.svelte';

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

<Toaster position="top-center" />
{@render children()}

<DesignElement />
