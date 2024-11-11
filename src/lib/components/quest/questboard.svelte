<script lang="ts">
	import type { Tables } from '$lib/types/SupabaseTypes';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { ToggleQuestSchema } from '$lib/validation/schema';
	import ToggleQuestForm from '../form/toggleQuestForm.svelte';
	type Props = {
		quests: Pick<Tables<'quest'>, 'id' | 'text'>[];
		formData: SuperValidated<Infer<ToggleQuestSchema>>;
		action: string;
		questIdsCompleted: number[];
	};
	let { quests, formData, action, questIdsCompleted }: Props = $props();
</script>

<article class="grid grid-cols-4">
	{#each quests as quest, i (crypto.randomUUID())}
		{@const completed = questIdsCompleted.includes(quest.id)}
		<ToggleQuestForm data={formData} {action} index={i} {quest} {completed} />
	{/each}
</article>
