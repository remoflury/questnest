<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Tables } from '$lib/types/SupabaseTypes';
	import Badge from '../ui/badge/badge.svelte';

	type Props = {
		questboard: Pick<Tables<'questboard'>, 'id' | 'name' | 'description'>;
		groupName: string;
	};

	let { questboard: q, groupName }: Props = $props();
</script>

<a href="/quests/{q.id}" title="go to {q.name}" aria-label="go to {q.name}">
	<Card.Root>
		<Card.Header>
			<Card.Title level={2}>{q.name}</Card.Title>
			{#if q.description}
				<Card.Description class="truncate">{q.description}</Card.Description>
			{/if}
		</Card.Header>
		<Card.Content class="pt-2">
			<Badge class="text-sm font-normal" variant="outline">{groupName}</Badge>
		</Card.Content>
	</Card.Root>
</a>
