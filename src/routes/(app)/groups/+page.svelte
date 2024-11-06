<script lang="ts">
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import AddGroupForm from '$lib/components/form/addGroupForm.svelte';

	let { data } = $props();
	let open = $state(true);
</script>

<FadeInWrapper class="section-spacing container" tag="section">
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
			>
				<Plus />
			</Button>
		{/snippet}
	</TitleWrapper>
</FadeInWrapper>
<Drawer.Root bind:open>
	<!-- <Drawer.Trigger>Open</Drawer.Trigger> -->
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Add new Group</Drawer.Title>
		</Drawer.Header>
		<Drawer.Footer>
			<AddGroupForm data={data.addGroupForm} action="?/addgroup" success={() => (open = false)} />
			<!-- <Button>Submit</Button>
			<Drawer.Close>Cancel</Drawer.Close> -->
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
