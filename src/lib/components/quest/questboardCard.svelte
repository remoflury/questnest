<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Badge from '../ui/badge/badge.svelte';

	type Props = {
		name: string;
		description: string | null;
		groupName: string;
	};

	let { name, description, groupName }: Props = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{name}</Card.Title>
		{#if description}
			<Card.Description class="truncate">{description}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content class="pt-2">
		<Badge class="text-sm font-normal" variant="outline">{groupName}</Badge>
	</Card.Content>
</Card.Root>
