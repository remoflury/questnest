<script lang="ts">
	import type { ApiResponse } from '$lib/types/GeneralTypes';
	import FetchError from '../general/fetchError.svelte';
	import { Skeleton } from '../ui/skeleton';
	import Score from './score.svelte';

	type Props = {
		countOtherMembers: number;
		questboardId: number;
	};
	let { countOtherMembers, questboardId }: Props = $props();

	const fetchResults = async () => {
		// await new Promise((resolve) => setTimeout(resolve, 100000));
		const res = await fetch(`/api/groupresults?questboard-id=${questboardId}`);
		const {
			payload,
			message,
			status
		}: ApiResponse<{
			allQuestIds: number[];
			resultsPerUser: {
				id: string;
				username: string;
				totalScore: number;
				questIdsCompleted: number[];
			}[];
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
	<article class="grid-spacing grid grid-cols-4">
		{#if countOtherMembers > 0}
			<div class="col-span-2 flex items-start gap-x-4">
				{#each resultsPerUser as user}
					<p class="">
						{user.username}
						<Score score={user.questIdsCompleted.length} />
						<Score text="Total Score:" score={user.totalScore} />
					</p>
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
		{:else}
			<p>No users in this group.</p>
		{/if}
	</article>
{:catch error}
	<FetchError message="Something went wrong." {error} />
{/await}
