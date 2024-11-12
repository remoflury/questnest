<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { addGroupSchema, type AddGroupSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '../ui/input';
	import { toast } from 'svelte-sonner';

	let {
		data,
		action
	}: {
		data: SuperValidated<Infer<AddGroupSchema>>;
		action: string;
	} = $props();

	let form = superForm(data, {
		validators: zodClient(addGroupSchema),
		dataType: 'json',
		onUpdate: ({ result }) => {
			console.log(result);
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
		}
	});

	let { form: formData, enhance, delayed, constraints } = form;
</script>

<form method="POST" use:enhance {action}>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Group name <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.name} {...$constraints.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full" loading={$delayed} disabled={$delayed} data-testid="submitgroup-btn"
		>Add Group</Form.Button
	>
</form>
