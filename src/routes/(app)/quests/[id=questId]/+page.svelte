<script lang="ts">
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Seo from '$lib/components/general/seo.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Questboard from '$lib/components/quest/questboard.svelte';
	import ResultsOtherGroupmembers from '$lib/components/quest/resultsOtherGroupmembers.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Edit } from 'lucide-svelte';

	let { data } = $props();
</script>

<Seo pageSeo={data.seo} />

<FadeInWrapper class="section-spacing container" tag="section">
	<article class="grid-content grid-spacing">
		<TitleWrapper tag="h1" class="mb-0">
			{#snippet text()}
				{data.questboard.name}
			{/snippet}
			{#snippet icon()}
				{#if data.questboard.quest.length}
					<Button
						class="!aspect-square p-2"
						title="edit quest"
						aria-label="edit quest"
						variant="secondary"
						href={`/quests/${data.questboard.id}/edit`}
						data-testid="editquest-btn"
					>
						<Edit class="stroke-primary" />
					</Button>
				{/if}
			{/snippet}
		</TitleWrapper>
		<Badge class="max-w-max text-sm font-normal" variant="outline"
			>{data.questboard.group.name}</Badge
		>
		{#if data.questboard.description}
			<p>{data.questboard.description}</p>
		{/if}

		{#if !data.questboard.quest.length}
			<Button
				class="max-w-max"
				href="/quests/{data.questboard.id}/create"
				title="create quests"
				aria-label="create quests"
				data-testid="createquests-btn">Create Quests</Button
			>
		{:else}
			<Questboard
				quests={data.questboard.quest}
				formData={data.toggleQuestForm}
				questIdsCompleted={data.questIdsCompleted}
				action="?/togglequest"
			/>
		{/if}
	</article>
</FadeInWrapper>

{#if data.questboard.quest.length}
	<FadeInWrapper tag="section" class="section-spacing container">
		<article class="grid-content grid-spacing">
			<TitleWrapper tag="h2" class="mb-0">
				{#snippet text()}
					Other Groupmembers
				{/snippet}
			</TitleWrapper>

			<ResultsOtherGroupmembers
				countOtherMembers={data.countOtherMembers}
				questboardId={data.questboard.id}
			/>
		</article>
	</FadeInWrapper>
{/if}
