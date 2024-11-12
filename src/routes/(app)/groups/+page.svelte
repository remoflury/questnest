<script lang="ts">
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import AddGroupForm from '$lib/components/form/addGroupForm.svelte';
	import { ChevronRight } from 'lucide-svelte/icons';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let open = $state(false);

	let groups = $derived(data.groups);
</script>

<FadeInWrapper class="section-t-spacing container" tag="section">
	<TitleWrapper tag="h1">
		{#snippet text()}
			Groups
		{/snippet}
		{#snippet icon()}
			<Button
				class="!aspect-square p-2"
				title="add group"
				aria-label="add group"
				onclick={() => (open = true)}
				data-testid="addgroup-btn"
			>
				<Plus />
			</Button>
		{/snippet}
	</TitleWrapper>
</FadeInWrapper>

<section class="grid-content grid-spacing section-b-spacing container">
	{#each groups as group (crypto.randomUUID())}
		<FadeInWrapper tag="a" href="/groups/{group.id}">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between gap-x-4 pb-6">
					<Card.Title level={2} class="mb-0">{group.name}</Card.Title>
					<ChevronRight />
				</Card.Header>
			</Card.Root>
		</FadeInWrapper>
	{/each}
</section>
<Drawer.Root bind:open>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Add new Group</Drawer.Title>
		</Drawer.Header>
		<Drawer.Footer>
			<AddGroupForm data={data.addGroupForm} action="?/addgroup" />
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
