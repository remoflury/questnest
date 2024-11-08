<script lang="ts">
	import type { ApiResponse } from '$lib/types/GeneralTypes';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { AddUserToGroupSchema } from '$lib/validation/schema';
	import type { Tables } from '$lib/types/SupabaseTypes';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import AddPersonToGroup from './addPersonToGroup.svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	type Props = {
		addUserToGroupForm: SuperValidated<Infer<AddUserToGroupSchema>>;
		usersOfGroup: string[];
		groupId: number;
	};
	let { addUserToGroupForm, groupId, usersOfGroup }: Props = $props();
	let query = $state('testuser');

	const fetchUsers = async () => {
		if (!query) return [];
		const res = await fetch(`/api/user?q=${query}`);
		const { payload, message, status }: ApiResponse<Tables<'user'>[]> = await res.json();
		if (status >= 400) {
			throw new Error(message);
		}
		users = payload;
	};

	let users: Tables<'user'>[] = $state([]);

	onMount(async () => await fetchUsers());
</script>

<h2>Add new user to group</h2>

<article>
	<Command.Root>
		<Command.Input
			bind:value={query}
			oninput={fetchUsers}
			placeholder="Search for username or email..."
		/>
	</Command.Root>
	{#if users.length}
		<div class="space-y-3 border-b border-secondary pb-4 pt-3" transition:slide={TRANSITION_CONFIG}>
			{#each users as user (user.id)}
				{@const isAlreadyInGroup = !!usersOfGroup.find((id) => id == user.id)}
				<div animate:flip={TRANSITION_CONFIG} class="px-8">
					<AddPersonToGroup
						username={user.username}
						userUid={user.id}
						{isAlreadyInGroup}
						action="/groups/{groupId}?/addtogroup"
						data={addUserToGroupForm}
						{groupId}
					/>
				</div>
			{/each}
		</div>
	{/if}
</article>
<p>
	Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam qui itaque odio? Aperiam facere
	nihil neque nulla, illo nostrum hic!
</p>
