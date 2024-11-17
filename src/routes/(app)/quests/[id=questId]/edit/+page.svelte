<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CreateQuestsForm from '$lib/components/form/createQuestsForm.svelte';
	import EditQuestsForm from '$lib/components/form/editQuestsForm.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Seo from '$lib/components/general/seo.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';

	let { data } = $props();
</script>

<Seo pageSeo={data.seo} />

<FadeInWrapper class="section-t-spacing container" tag="section">
	<TitleWrapper tag="h1" class="mb-0" goBackUri="/quests/{$page.params.id}">
		{#snippet text()}
			Edit Quests from {data.questboard.name}
		{/snippet}
	</TitleWrapper>
</FadeInWrapper>

<FadeInWrapper class="section-spacing container" tag="section">
	<EditQuestsForm
		data={data.editQuestsForm}
		action="?/editquests"
		redirect="/quests/{$page.params.id}"
		oncloseForm={async () => await goto(`/quests/${$page.params.id}`)}
	/>
</FadeInWrapper>
