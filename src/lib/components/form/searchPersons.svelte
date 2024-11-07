<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import type { ApiResponse } from '$lib/types/GeneralTypes';
	import type { Tables } from '$lib/types/SupabaseTypes';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import AddPersonToGroup from './addPersonToGroup.svelte';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import { page } from '$app/stores';

	let query = $state('testuser');

	const fetchUsers = async () => {
		if (!query) return [];
		const res = await fetch(`/api/user?q=${query}`);
		const { payload, message, status }: ApiResponse<Tables<'user'>[]> = await res.json();
		console.log(payload);
		if (status >= 400) {
			throw new Error(message);
		}
		users = payload;
	};

	let users: Tables<'user'>[] = $state([]);

	$inspect($page.url.pathname);

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
		<div class=" border-b border-secondary pb-4 pt-2" transition:slide={TRANSITION_CONFIG}>
			{#each users as user (user.id)}
				<div animate:flip={TRANSITION_CONFIG} class="px-8 py-1">
					<AddPersonToGroup
						username={user.username}
						userUid={user.id}
						isAlreadyInGroup={false}
						action="{$page.url.pathname}?/addtogroup"
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
