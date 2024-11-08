<script lang="ts">
	import SearchPersons from '$lib/components/form/searchPersons.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { data } = $props();

	let userIdsOfGroup = $derived.by(() =>
		data.group.users.map((user) => {
			return user.id;
		})
	);
	$inspect(userIdsOfGroup);
</script>

<FadeInWrapper class="section-t-spacing container" tag="section">
	<TitleWrapper tag="h1">
		{#snippet text()}
			{data.group.name}
		{/snippet}
	</TitleWrapper>
</FadeInWrapper>
<FadeInWrapper class="section-t-spacing container" tag="section">
	<article>
		<TitleWrapper tag="h2">
			{#snippet text()}
				Members
			{/snippet}
		</TitleWrapper>
		<div class="flex flex-wrap gap-x-4 gap-y-2">
			{#each data.group.users as user}
				<Badge variant="secondary">{user.username}</Badge>
			{/each}
		</div>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<SearchPersons
		addUserToGroupForm={data.addUserToGroupForm}
		groupId={data.group.id}
		{userIdsOfGroup}
	/>
</FadeInWrapper>
