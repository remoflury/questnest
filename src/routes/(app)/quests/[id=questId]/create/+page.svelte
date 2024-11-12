<script lang="ts">
	import { page } from '$app/stores';
	import CreateQuestsForm from '$lib/components/form/createQuestsForm.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';

	let { data } = $props();
</script>

<FadeInWrapper class="section-t-spacing container" tag="section">
	<TitleWrapper tag="h1" className="mb-0">
		{#snippet text()}
			Add Quests to {data.questboard.name}
		{/snippet}
	</TitleWrapper>
</FadeInWrapper>

<FadeInWrapper class="section-spacing container" tag="section">
	<CreateQuestsForm
		data={data.createQuestsForm}
		action="?/createquests"
		redirect={`/quests/${$page.params.id}`}
	/>
</FadeInWrapper>
