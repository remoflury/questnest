<script lang="ts">
	import '../css/main.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import PageLoader from '$lib/components/general/pageLoader.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import DevPopUp from '$lib/components/general/devPopUp.svelte';
	import { browser } from '$app/environment';

	let { children, data } = $props();
	let supabase = $state(data.supabase);
	let session = $state(data.session);
	let showDevPopUp = $state(true);

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
<ModeWatcher />
<PageLoader />
{@render children()}

<DevPopUp bind:open={showDevPopUp} />
