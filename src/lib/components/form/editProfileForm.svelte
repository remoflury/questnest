<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { editProfileSchema, type EditProfileSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '../ui/input';
	import Button from '../ui/button/button.svelte';
	import { toast } from 'svelte-sonner';

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
		}
	});

	let { form: formData, enhance, delayed } = form;
</script>

<form method="POST" use:enhance {action}>
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.email} type="email" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Username <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.username} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<!-- <Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.password} type="password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="passwordConfirm">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm password <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.passwordConfirm} type="password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field> -->
	<div class="grid-spacing flex flex-wrap">
		<Button type="button" variant="destructive" class="mt-2" onclick={oncloseForm}>Cancel</Button>
		<Form.Button loading={$delayed} disabled={$delayed}>Save</Form.Button>
	</div>
</form>
