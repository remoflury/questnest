<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';

	interface BeforeInstallPromptEvent extends Event {
		readonly platforms: string[];
		readonly userChoice: Promise<{
			outcome: 'accepted' | 'dismissed';
			platform: string;
		}>;
		prompt(): Promise<void>;
	}
	type Props = {
		onpwaIsInstallable?: () => true;
		onpwaIsNotInstallable?: () => false;
	};
	let { onpwaIsInstallable, onpwaIsNotInstallable }: Props = $props();
	let deferredPrompt: null | BeforeInstallPromptEvent = $state(null);
	let showInstallButton = $state(false);

	// Check if the app is already installed
	onMount(() => {
		if (window.matchMedia('(display-mode: standalone)').matches) {
			// Open the app in standalone mode if installed
			const appUrl = '/'; // Change to your app's entry point
			if (window.location.pathname !== appUrl) {
				window.location.replace(appUrl);
			}
			return;
		}

		// Listen for the PWA install prompt
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e as BeforeInstallPromptEvent;
			showInstallButton = true; // Show the install button
			onpwaIsInstallable?.();
		});

		// Hide the button if already installed
		window.addEventListener('appinstalled', () => {
			showInstallButton = false;
			deferredPrompt = null;
		});
	});

	function installPWA() {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === 'accepted') {
					console.log('User accepted the install prompt');
				} else {
					console.log('User dismissed the install prompt');
				}
				deferredPrompt = null;
				showInstallButton = false; // Hide the button after installation
				onpwaIsNotInstallable?.();
			});
		}
	}
</script>

{#if showInstallButton}
	<Button onclick={installPWA} title="install app" aria-label="install questnest app">
		Install App
	</Button>
{/if}
