<script>
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Profile from '$lib/components/settings/profile.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Edit } from 'lucide-svelte';

	let { data } = $props();
	let edit = $state(true);
</script>

<FadeInWrapper class="section-spacing container" tag="section">
	<TitleWrapper tag="h1">
		{#snippet text()}
			Settings
		{/snippet}
	</TitleWrapper>
	<p>Change your profile credentials.</p>
</FadeInWrapper>

<FadeInWrapper class="section-spacing container" tag="section">
	<TitleWrapper>
		{#snippet text()}
			Profile
		{/snippet}
		{#snippet icon()}
			{#if !edit}
				<Button
					class="!aspect-square p-2"
					title="edit quest"
					aria-label="edit quest"
					variant="secondary"
					onclick={() => (edit = true)}
				>
					<Edit class="stroke-primary" />
				</Button>
			{/if}
		{/snippet}
	</TitleWrapper>
	<Profile
		bind:edit
		user={data.user}
		editProfileForm={data.editProfileForm}
		action="?/editprofile"
	/>
</FadeInWrapper>
