<script>
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';
	import Seo from '$lib/components/general/seo.svelte';

	let { data } = $props();
</script>

<Seo pageSeo={data.seo} />

<FadeInWrapper tag="a" class="section-spacing grid-content grid-spacing container">
	<h1>Bring Your Friends Together with QuestNest!</h1>
	<p class="font-bold" data-testid="lead">
		Welcome to QuestNest, the ultimate app for unforgettable moments with friends. Create custom
		bingo cards, filled with challenges and dares designed by your group, and see who can check off
		the most! Whether you're planning a game night, a weekend getaway, or just a fun evening with
		friends, QuestNest adds a twist of excitement and brings everyone closer together.
	</p>
</FadeInWrapper>
<FadeInWrapper tag="section" class="section-spacing container">
	<article class="grid-content grid-spacing">
		<p>Ready to start the fun?</p>
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
			<Button href="/quests" title="to the app" class="max-w-max" data-testid="app-btn">
				Go To App
			</Button>
		{/if}
	</article>
</FadeInWrapper>
