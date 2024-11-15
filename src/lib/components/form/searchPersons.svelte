<script lang="ts">
	import type { ApiResponse } from '$lib/types/GeneralTypes';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { AddUserToGroupSchema } from '$lib/validation/schema';
	import type { Tables } from '$lib/types/SupabaseTypes';
	import { flip } from 'svelte/animate';
	import { fade, slide } from 'svelte/transition';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import AddPersonToGroup from './addPersonToGroup.svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import FetchError from '../general/fetchError.svelte';
	import { debounce } from '$lib/utils/utils';
	import { LoaderCircle } from 'lucide-svelte';

	type Props = {
		addUserToGroupForm: SuperValidated<Infer<AddUserToGroupSchema>>;
		userIdsOfGroup: string[];
		groupId: number;
	};

	let { addUserToGroupForm, groupId, userIdsOfGroup }: Props = $props();
	let query = $state('');
	let error = $state('');
	let isLoading = $state(false);

	const debounceSearch = debounce(() => {
		fetchUsers();
	});

	// Update query and trigger debounced search
	const handleInput = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		query = value; // Update query
		query ? (isLoading = true) : (isLoading = false);
		debounceSearch(value); // Trigger debounced fetch
	};

	const fetchUsers = async () => {
		if (!query) {
			isLoading = false;
			return [];
		}
		try {
			const res = await fetch(`/api/user?q=${query}`);
			const { payload, message, status }: ApiResponse<{ users: Tables<'user'>[] }> =
				await res.json();
			if (status >= 400) {
				error = message!;
				throw new Error(message);
			}
			users = payload.users;
		} catch (err) {
			console.error(err);
			error = err as string;
		}
		isLoading = false;
	};

	let users: Tables<'user'>[] = $state([]);
</script>

<h2>Add member</h2>

<article>
	<Command.Root>
		<Command.Input
			bind:value={query}
			oninput={handleInput}
			placeholder="Search for username or email..."
		/>
	</Command.Root>
	{#if error && query.length}
		<FetchError message="Something went wrong." {error} />
	{/if}

	{#if isLoading}
		<figure class="px-8 pb-4 pt-3" in:slide={TRANSITION_CONFIG}>
			<LoaderCircle class="animate-spin stroke-primary" />
		</figure>
	{:else if users.length && query.length && !error}
		<div class="space-y-3 pb-4 pt-3" transition:slide={TRANSITION_CONFIG}>
			{#each users as user (user.id)}
				{@const isAlreadyInGroup = !!userIdsOfGroup.find((id) => id == user.id)}
				<div animate:flip={TRANSITION_CONFIG} class="px-8">
					<AddPersonToGroup
						{user}
						{isAlreadyInGroup}
						action="/groups/{groupId}?/addtogroup"
						data={addUserToGroupForm}
						{groupId}
					/>
				</div>
			{/each}
		</div>
	{:else if query.length && !users.length && !error}
		<p class="px-8 pb-2 pt-3 text-sm" in:slide={TRANSITION_CONFIG}>
			No results for <em>{query}</em>
		</p>
	{/if}
</article>
