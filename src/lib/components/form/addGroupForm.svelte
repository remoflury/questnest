<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { addGroupSchema, type AddGroupSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '../ui/input';
	import { toast } from 'svelte-sonner';

	let {
		data,
		action,
		success
	}: { data: SuperValidated<Infer<AddGroupSchema>>; action: string; success: () => void } =
		$props();

	let form = superForm(data, {
		validators: zodClient(addGroupSchema),
		dataType: 'json',
		onUpdate: ({ result }) => {
			if (result.type == 'failure') toast.error(result.data.form.message);
			toast.success(result.data.form.message);
			success();
		}
	});

	let { form: formData, enhance, delayed } = form;
</script>

<form method="POST" use:enhance {action}>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Group name <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full" loading={$delayed} disabled={$delayed}>Add Group</Form.Button>
</form>
