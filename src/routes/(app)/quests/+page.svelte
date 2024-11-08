<script lang="ts">
	import AddQuestboardForm from '$lib/components/form/addQuestboardForm.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Plus } from 'lucide-svelte';

	let { data } = $props();

	let open = $state(false);
</script>

<FadeInWrapper class="section-spacing container" tag="section">
	<TitleWrapper tag="h1">
		{#snippet text()}
			Quests
		{/snippet}
		{#snippet icon()}
			<Button
				class="!aspect-square p-2"
				title="add quest"
				aria-label="add quest"
				onclick={() => (open = true)}
			>
				<Plus />
			</Button>
		{/snippet}
	</TitleWrapper>
</FadeInWrapper>

<!-- Add new quest -->
<Drawer.Root bind:open>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Add new Quest</Drawer.Title>
		</Drawer.Header>
		<Drawer.Footer>
			<AddQuestboardForm
				action="?/addquestboard"
				data={data.addQuestboardForm}
				groupsOfUser={data.groupsOfUser}
			/>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
