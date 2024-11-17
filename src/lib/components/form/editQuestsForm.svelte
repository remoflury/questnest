<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { editQuestsSchema, type EditQuestsSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '../ui/input';
	import { toast } from 'svelte-sonner';
	import { QUESTS_PER_BOARD } from '$lib/utils/constants';
	import { goto } from '$app/navigation';
	import Button from '../ui/button/button.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';

	type Props = {
		data: SuperValidated<Infer<EditQuestsSchema>>;
		action: string;
		redirect: string;
		oncloseForm?: () => void;
	};

	let { data, action, redirect, oncloseForm }: Props = $props();

	let form = superForm(data, {
		validators: zodClient(editQuestsSchema),
		dataType: 'json',
		taintedMessage: 'Are you sure you want to leave?',
		onUpdate: async ({ result }) => {
			if (result.type == 'failure') {
				return toast.error(result.data.form.message ?? 'Something went wrong.');
			}
			toast.success(result.data.form.message);
			await goto(redirect);
		}
	});

	let { form: formData, enhance, delayed, errors, constraints } = form;
</script>

<form method="POST" use:enhance {action} class="space-y-3">
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Questboard Name <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.name} {...$constraints.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Textarea {...props} bind:value={$formData.description} {...$constraints.description} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	{#each Array.from({ length: QUESTS_PER_BOARD }) as _, i}
		<Form.Field {form} name="quests">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Quest {i + 1} <sup>*</sup></Form.Label>
					<Input
						{...props}
						bind:value={$formData.quests[i].text}
						{...$constraints.quests?.text}
						data-testid={`addquest-input-${i}`}
					/>
				{/snippet}
			</Form.Control>
			{#if $errors.quests?.[i]?.text}
				<div class="text-sm font-medium text-destructive">{$errors.quests[i].text}</div>
			{/if}
		</Form.Field>
	{/each}

	<div class="grid-spacing flex flex-wrap">
		<Button type="button" variant="destructive" class="mt-2" onclick={oncloseForm}>Cancel</Button>
		<Form.Button loading={$delayed} disabled={$delayed}>Save</Form.Button>
	</div>
</form>
