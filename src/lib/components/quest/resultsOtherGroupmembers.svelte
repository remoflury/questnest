<script lang="ts">
	import type { ApiResponse } from '$lib/types/GeneralTypes';
	import FetchError from '../general/fetchError.svelte';
	import { Skeleton } from '../ui/skeleton';

	type Props = {
		countOtherMembers: number;
		questboardId: number;
	};
	let { countOtherMembers, questboardId }: Props = $props();

	const fetchResults = async () => {
		const res = await fetch(`/api/groupresults?questboard-id=${questboardId}`);
		const {
			payload,
			message,
			status
		}: ApiResponse<{
			allQuestIds: number[];
			resultsPerUser: { user: string; username: string; questIdsCompleted: number[] }[];
		}> = await res.json();

		if (status >= 400) {
			throw new Error(message);
		}
		return payload;
	};
</script>

{#await fetchResults()}
	<div class="grid-spacing grid grid-cols-4" aria-busy="true">
		{#each Array.from({ length: countOtherMembers }) as _}
			<div class="col-span-2 flex items-start gap-x-4" aria-busy="true" role="presentation">
				<Skeleton class="h-4 w-20" />
				<Skeleton class="aspect-[1/1.3] w-16"></Skeleton>
			</div>
		{/each}
	</div>
{:then { resultsPerUser, allQuestIds }}
	{#if resultsPerUser.length}
		<article class="grid-spacing grid grid-cols-4">
			<div class="col-span-2 flex items-start gap-x-4">
				{#each resultsPerUser as user}
					{user.username}

					<div class="grid max-w-max grid-cols-4">
						{#each allQuestIds as id}
							{@const completed = user.questIdsCompleted.includes(id)}
							<span
								class="h-3 w-3 border"
								class:bg-primary={completed}
								class:border-primary={completed}
							></span>
						{/each}
					</div>
				{/each}
			</div>
		</article>
	{/if}
{:catch error}
	<FetchError message="Something went wrong." {error} />
{/await}
