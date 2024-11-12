<script lang="ts">
	import { editProfileSchema, type EditProfileSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	type Props = {
		data: SuperValidated<Infer<EditProfileSchema>>;
		action: string;
		oncloseForm?: () => void;
	};
	let { data, action, oncloseForm }: Props = $props();

	let form = superForm(data, {
		validators: zodClient(editProfileSchema),
		dataType: 'json',
		onUpdate: async ({ result }) => {
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
			oncloseForm?.();
		}
	});

	let { form: formData, enhance, delayed, constraints } = form;
</script>

<form method="POST" use:enhance {action}>
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.email} type="email" {...$constraints.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Username <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.username} {...$constraints.username} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="grid-spacing flex flex-wrap">
		<Button type="button" variant="destructive" class="mt-2" onclick={oncloseForm}>Cancel</Button>
		<Form.Button loading={$delayed} disabled={$delayed}>Save</Form.Button>
	</div>
</form>
