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
			Edit Quests from {data.questboard.name}
		{/snippet}
	</TitleWrapper>
</FadeInWrapper>

<FadeInWrapper class="section-spacing container" tag="section">
	<CreateQuestsForm
		data={data.editQuestsForm}
		action="?/editquests"
		redirect="/quests/{$page.params.id}"
	/>
</FadeInWrapper>
