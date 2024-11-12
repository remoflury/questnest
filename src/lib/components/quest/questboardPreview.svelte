<script lang="ts">
	import type { Tables } from '$lib/types/SupabaseTypes';
	import Badge from '../ui/badge/badge.svelte';
	import * as Card from '../ui/card';

	type Props = {
		questboard: Pick<Tables<'questboard'>, 'id' | 'name' | 'description'>;
	};

	let { questboard: q }: Props = $props();
</script>

<a href="/quests/{q.id}" aria-label="to quest {q.name}" title="to quest {q.name}">
	<Card.Root>
		<Card.Header class="pb-6">
			<Card.Title>{q.name}</Card.Title>
			{#if q.description}
				<Card.Description class="truncate">{q.description}</Card.Description>
			{/if}
		</Card.Header>
	</Card.Root>
</a>
