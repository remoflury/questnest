<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Users, Logs, Settings } from 'lucide-svelte';

	let { children } = $props();

	let navItems = $state([
		{
			label: 'Groups',
			icon: Users,
			href: '/groups'
		},
		{
			label: 'Quests',
			icon: Logs,
			href: '/quests'
		},
		{
			label: 'Settings',
			icon: Settings,
			href: '/settings'
		}
	]);

	$inspect($page.url.pathname.split('/')[1]);
</script>

{@render children()}
<nav class="shadow-top fixed bottom-0 left-0 right-0 bg-white py-4">
	<div class="container flex items-center justify-around">
		{#each navItems as item (crypto.randomUUID())}
			{@const current = $page.url.pathname.split('/')[1] === item.href.split('/')[1]}
			<Button
				class="aspect-square h-10 w-10 "
				variant={current ? 'default' : 'ghost'}
				href={item.href}
				title="go to {item.label}"
				aria-label="go to {item.label}"
			>
				<item.icon />
			</Button>
		{/each}
	</div>
</nav>
