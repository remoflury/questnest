<script lang="ts">
	import type { ApiResponse } from '$lib/types/GeneralTypes';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { AddUserToGroupSchema } from '$lib/validation/schema';
	import type { Tables } from '$lib/types/SupabaseTypes';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import AddPersonToGroup from './addPersonToGroup.svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import FetchError from '../general/fetchError.svelte';

	type Props = {
		addUserToGroupForm: SuperValidated<Infer<AddUserToGroupSchema>>;
		userIdsOfGroup: string[];
		groupId: number;
	};

	let { addUserToGroupForm, groupId, userIdsOfGroup }: Props = $props();
	let query = $state('');
	let error = $state('');

	const fetchUsers = async () => {
		if (!query) return [];
		const res = await fetch(`/api/user?q=${query}`);
		const { payload, message, status }: ApiResponse<Tables<'user'>[]> = await res.json();
		if (status >= 400) {
			error = message!;
			throw new Error(message);
			// TODO catch error in html code
		}
		users = payload;
	};

	let users: Tables<'user'>[] = $state([]);
</script>

<h2>Add member</h2>

<article>
	<Command.Root>
		<Command.Input
			bind:value={query}
			oninput={fetchUsers}
			placeholder="Search for username or email..."
		/>
	</Command.Root>
	{#if error && query.length}
		<FetchError message="Something went wrong." {error} />
	{/if}
	{#if users.length && query.length}
		<div class="space-y-3 pb-4 pt-3" transition:slide={TRANSITION_CONFIG}>
			{#each users as user (user.id)}
				{@const isAlreadyInGroup = !!userIdsOfGroup.find((id) => id == user.id)}
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
