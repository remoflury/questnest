<script lang="ts">
	import LogoutForm from '$lib/components/form/logoutForm.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Seo from '$lib/components/general/seo.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import LightSwitchSwitch from '$lib/components/lightSwitch/lightSwitchSwitch.svelte';
	import Score from '$lib/components/quest/score.svelte';
	import Password from '$lib/components/settings/password.svelte';
	import Profile from '$lib/components/settings/profile.svelte';
	import ProfileInfos from '$lib/components/settings/profileInfos.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Edit } from 'lucide-svelte';

	let { data } = $props();
	let editProfile = $state(false);
	let editPassword = $state(false);

	let activePlan = $derived(data.plans.find((plan) => plan.supabasePlanId == data.usersPlanId));

	// $inspect(data.plans);
	// $inspect(data.usersPlanId);
</script>

<Seo pageSeo={data.seo} />

<FadeInWrapper class="section-spacing container" tag="section">
	<TitleWrapper tag="h1">
		{#snippet text()}
			Settings
		{/snippet}

		{#snippet icon()}
			<LogoutForm variant="secondary" />
		{/snippet}
	</TitleWrapper>

	<Score
		text="Your current score:"
		score={data.user.score}
		class="text-lg font-bold text-foreground"
		classScore="pl-4"
	/>
</FadeInWrapper>

<FadeInWrapper class="section-spacing container" tag="section">
	<article class="grid-content grid-spacing">
		<TitleWrapper>
			{#snippet text()}
				Profile
			{/snippet}
			{#snippet icon()}
				{#if !editProfile}
					<Button
						class="!aspect-square p-2"
						title="edit profile"
						aria-label="edit profile"
						onclick={() => (editProfile = true)}
					>
						<Edit class="stroke-secondary dark:stroke-foreground" />
					</Button>
				{/if}
			{/snippet}
		</TitleWrapper>
		<p>Change your profile credentials.</p>

		<Profile
			bind:edit={editProfile}
			user={data.user}
			editProfileForm={data.editProfileForm}
			action="?/editprofile"
		/>

		<TitleWrapper class="mb-0 mt-4">
			{#snippet text()}
				Password
			{/snippet}
			{#snippet icon()}
				{#if !editPassword}
					<Button
						class="!aspect-square p-2"
						title="change password"
						aria-label="change password"
						onclick={() => (editPassword = true)}
					>
						<Edit class="stroke-secondary dark:stroke-foreground" />
					</Button>
				{/if}
			{/snippet}
		</TitleWrapper>
		<Password bind:edit={editPassword} editPwForm={data.editPasswordForm} action="?/changepw" />
	</article>
</FadeInWrapper>

<FadeInWrapper class="section-spacing container" tag="section">
	<article class="grid-content grid-spacing">
		<TitleWrapper tag="h1">
			{#snippet text()}
				Your current plan
			{/snippet}
		</TitleWrapper>

		{#if activePlan}
			<p>Subscription: <strong>{activePlan.plan.name}</strong></p>
		{/if}

		<!-- <ProfileInfos title="Switch Theme"> -->
		<Button variant="secondary" href="/pricing" class="max-w-max">To all plans</Button>
	</article>
	<!-- </ProfileInfos> -->
</FadeInWrapper>

<FadeInWrapper class="section-spacing container" tag="section">
	<TitleWrapper tag="h1">
		{#snippet text()}
			Settings
		{/snippet}
	</TitleWrapper>
	<ProfileInfos title="Switch Theme">
		<LightSwitchSwitch class="mt-2" id="theme-switch" />
	</ProfileInfos>
</FadeInWrapper>
