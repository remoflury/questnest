<script lang="ts">
	import { page } from '$app/stores';
	import { menu } from '$lib/store/store';
	import * as Sheet from '$lib/components/ui/sheet';
	import LogoutForm from '../form/logoutForm.svelte';
	import Button from '../ui/button/button.svelte';
	import { Menu } from 'lucide-svelte';
	import { cn } from '$lib/utils/utils';
	import { beforeNavigate } from '$app/navigation';
	import { string } from 'zod';
	import LightSwitch from '../general/LightSwitch.svelte';
	type NavItem = {
		href: string;
		label: string;
	};

	let open = $state(false);

	beforeNavigate(() => (open = false));

	const loggedOutItems: Readonly<NavItem[]> = [
		// {
		// 	href: '/',
		// 	label: 'Label'
		// }
	];

	const loggedInItems: Readonly<NavItem[]> = [
		// {
		// 	href: '/',
		// 	label: 'Label loggedin'
		// }
	];
</script>

{#snippet homeLink(className?: string)}
	<a href="/" class={cn('flex max-w-1/2 items-center gap-x-3', className)}>
		<img src="/assets/chicken.svg" alt="logo" />
		<span class="font-dm-serif text-lg font-bold">QuestNest</span>
	</a>
{/snippet}

<nav class="grid-content grid-spacing container pt-3" bind:clientHeight={$menu.heightNav}>
	{@render homeLink('col-span-1 lg:col-span-2')}

	<button
		class="col-span-1 -col-end-1 justify-self-end"
		title="{open ? 'close' : 'open'} menu"
		onclick={() => (open = true)}
	>
		<Menu class="stroke-foreground" />
	</button>
</nav>

<Sheet.Root bind:open>
	<Sheet.Content class="w-full sm:w-3/4">
		<Sheet.Header class="space-y-8 text-left">
			{@render homeLink('max-w-[2rem]')}

			<Sheet.Title hidden>Menu</Sheet.Title>

			<ul class="space-y-4">
				{#if !$page.data.session}
					{#each loggedOutItems as item}
						<li>
							<Button href={item.href} variant="link" class="h-auto p-0">{item.label}</Button>
						</li>
					{/each}
					<li class="flex flex-wrap gap-x-8 gap-y-2">
						<Button
							href="/signup"
							title="Sign up for a new account"
							aria-label="Sign up for a new account"
							data-testid="signup-btn">Sign Up</Button
						>
						<Button
							href="/signin"
							variant="secondary"
							title="login to your account"
							aria-label="login in your account"
							data-testid="signin-btn">Sign In</Button
						>
					</li>
				{/if}
				{#if $page.data.session}
					{#each loggedInItems as item}
						<li>
							<Button href={item.href} variant="link" class="px-0">{item.label}</Button>
						</li>
					{/each}
					<LogoutForm variant="secondary" className="col-span-1 -col-end-1 ml-auto mt-4" />
				{/if}
			</ul>
			<LightSwitch />
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
