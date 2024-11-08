<script lang="ts">
	import { page } from '$app/stores';
	import RemoveFromGroup from '$lib/components/form/removeFromGroup.svelte';
	import SearchPersons from '$lib/components/form/searchPersons.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { X } from 'lucide-svelte';

	type User = {
		id: string;
		username: string;
	};
	let { data } = $props();
	let open = $state(false);
	let userToRemove: User | null = $state(null);

	let userIdsOfGroup = $derived.by(() =>
		data.group.users.map((user) => {
			return user.id;
		})
	);

	const setUser = (user: User | null) => {
		userToRemove = user;
		open = !open;
	};
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
				{@const isOwnUser = $page.data.session?.user.id == user.id}
				<Badge
					variant="secondary"
					class="flex items-center gap-x-1 {isOwnUser ? '' : 'pr-0'}"
					draggable={false}
					>{user.username}
					{#if !isOwnUser}
						<Button
							type="button"
							variant="ghost"
							class="h-2 w-2"
							onclick={() => setUser(user)}
							aria-label="remove {user.username} from group"
							title="remove {user.username} from group"
						>
							<X />
						</Button>
					{/if}
				</Badge>
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
<FadeInWrapper tag="span" role="presentation">
	<Separator />
</FadeInWrapper>
<FadeInWrapper tag="section" class="section-spacing container">
	<TitleWrapper>
		{#snippet text()}
			Quests
		{/snippet}
	</TitleWrapper>
</FadeInWrapper>

<RemoveFromGroup
	bind:open
	data={data.removeUserFromGroupForm}
	action="?/removefromgroup"
	{userToRemove}
	groupId={data.group.id}
	oncancel={() => setUser(null)}
	onsuccess={() => setUser(null)}
/>
