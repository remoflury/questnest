<script lang="ts">
	import { page } from '$app/stores';
	import { menu } from '$lib/store/store';
	import LogoutForm from '../form/logoutForm.svelte';
	import Button from '../ui/button/button.svelte';
</script>

<nav class="grid-content grid-spacing container pt-3" bind:clientHeight={$menu.heightNav}>
	<a href="/" class="col-span-1 flex max-w-1/2 items-center gap-x-3 lg:col-span-2">
		<img src="/assets/chicken.svg" alt="logo" />
		<span class="font-dm-serif text-lg font-bold">QuestNest</span>
	</a>

	{#if $page.data.session}
		{#if !$page.data.session}
			<div class="flex flex-wrap gap-x-8 gap-y-2">
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
			</div>
		{:else}
			<LogoutForm variant="secondary" className="col-span-1 -col-end-1 ml-auto" />
		{/if}
	{/if}
</nav>
