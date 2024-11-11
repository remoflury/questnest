<script lang="ts">
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Questboard from '$lib/components/quest/questboard.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button';
	// import Button from "$lib/components/ui/button/button.svelte";

	let { data } = $props();
</script>

<FadeInWrapper class="section-spacing container" tag="section">
	<article class="grid-content grid-spacing">
		<TitleWrapper tag="h1" className="mb-0">
			{#snippet text()}
				{data.questboard.name}
			{/snippet}
			<!-- TODO: Enable editing -->
			<!-- {#snippet icon()}
			<Button
      class="!aspect-square p-2"
      title="add quest"
      aria-label="add quest"
      onclick={() => (open = true)}
			>
      <Plus />
			</Button>
      {/snippet} -->
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
				aria-label="create quests">Create Quests</Button
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
