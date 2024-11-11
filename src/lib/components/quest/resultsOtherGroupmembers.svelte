<script lang="ts">
	import type { ApiResponse } from '$lib/types/GeneralTypes';
	import type { Tables } from '$lib/types/SupabaseTypes';

	type Props = {
		countOtherMembers: number;
		groupId?: number;
		questboardId: number;
	};
	let { countOtherMembers, groupId, questboardId }: Props = $props();

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
			// TODO catch error in html code
		}
		return payload;
	};
</script>

{#await fetchResults()}
	loading
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
{/await}
