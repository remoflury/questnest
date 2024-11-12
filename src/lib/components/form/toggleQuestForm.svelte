<script lang="ts">
	import type { Tables } from '$lib/types/SupabaseTypes';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import { toggleQuestSchema, type ToggleQuestSchema } from '$lib/validation/schema';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { scale } from 'svelte/transition';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<Infer<ToggleQuestSchema>>;
		action: string;
		quest: Pick<Tables<'quest'>, 'id' | 'text'>;
		completed: boolean;
		index: number;
	};

	let { data, action, quest, completed, index }: Props = $props();

	let form = superForm(data, {
		id: crypto.randomUUID(),
		validators: zodClient(toggleQuestSchema),
		dataType: 'json',
		onSubmit: () => {
			$formData.id = quest.id;
		},
		onUpdate: async ({ result }) => {
			console.log(result);
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
		}
	});

	let { form: formData, enhance, delayed } = form;
</script>

<form
	method="POST"
	use:enhance
	{action}
	class="grid aspect-[1/1.5] place-content-stretch border-l border-t border-secondary"
	class:border-r={(index + 1) % 4 === 0}
	class:border-b={index + 1 >= 21}
	class:bg-primary={completed}
>
	<button class="p-1" aria-label="toggle quest number {index + 1}">
		{#if $delayed}
			<figure in:scale={TRANSITION_CONFIG}>
				<LoaderCircle class="mx-auto animate-spin stroke-secondary" />
			</figure>
		{:else}
			<small class="text-center" class:text-white={completed} in:scale={TRANSITION_CONFIG}
				>{quest.text}</small
			>
		{/if}
	</button>
</form>
