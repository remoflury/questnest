<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { createQuestsSchema, type CreateQuestsSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '../ui/input';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { QUESTS_PER_BOARD } from '$lib/utils/constants';

	let { data, action }: { data: SuperValidated<Infer<CreateQuestsSchema>>; action: string } =
		$props();

	let form = superForm(data, {
		validators: zodClient(createQuestsSchema),
		dataType: 'json',
		onUpdate: async ({ result }) => {
			if (result.type == 'failure') {
				return toast.error(result.data.form.message);
			}
			toast.success(result.data.form.message);
			await goto(`/quests/${$formData.questboard}`);
		}
	});

	let { form: formData, enhance, delayed, constraints } = form;
</script>

<form method="POST" use:enhance {action} class="space-y-3">
	{#each Array.from({ length: QUESTS_PER_BOARD }) as _, i}
		<Form.Field {form} name="quests">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Quest {i + 1} <sup>*</sup></Form.Label>
					<Input {...props} bind:value={$formData.quests[i].text} {...$constraints} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	{/each}
	<Form.Button loading={$delayed} disabled={$delayed}>Save Quests</Form.Button>
</form>
