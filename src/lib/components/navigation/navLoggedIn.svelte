<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { menu } from '$lib/store/store';
	import { Users, Logs, Settings } from 'lucide-svelte';

	let navAppElemClientHeight: number = $state(0);

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

	$effect(() => {
		$menu.heightAppNav = navAppElemClientHeight;
	});
</script>

<nav
	class="fixed bottom-0 left-0 right-0 bg-background py-4 shadow-[0px_-5px_10px_0px_hsl(var(--foreground)/0.05)]"
	bind:clientHeight={navAppElemClientHeight}
>
	<div class="container flex items-center justify-around">
		{#each navItems as item (crypto.randomUUID())}
			{@const current = $page.url.pathname.split('/')[1] === item.href.split('/')[1]}
			<Button
				class="aspect-square h-10 w-10 "
				variant={current ? 'default' : 'ghost'}
				href={item.href}
				title="go to {item.label}"
				aria-label="go to {item.label}"
				draggable={false}
			>
				<item.icon />
			</Button>
		{/each}
	</div>
</nav>
