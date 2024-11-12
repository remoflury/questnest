<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { changePwSchema, type ChangePwSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '../ui/input';
	import Button from '../ui/button/button.svelte';
	import { toast } from 'svelte-sonner';

	type Props = {
		data: SuperValidated<Infer<ChangePwSchema>>;
		action: string;
		oncloseForm?: () => void;
	};
	let { data, action, oncloseForm }: Props = $props();

	let form = superForm(data, {
		validators: zodClient(changePwSchema),
		dataType: 'json',
		onUpdate: async ({ result }) => {
			console.log(result);
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
			oncloseForm?.();
		}
	});

	let { form: formData, enhance, delayed } = form;
</script>

<form method="POST" use:enhance {action}>
	<Form.Field {form} name="currentPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Current Password <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.currentPassword} type="password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="newPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>New password <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.newPassword} type="password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="newPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm new password <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.newPasswordConfirm} type="password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="grid-spacing flex flex-wrap">
		<Button type="button" variant="destructive" class="mt-2" onclick={oncloseForm}>Cancel</Button>
		<Form.Button loading={$delayed} disabled={$delayed}>Save</Form.Button>
	</div>
</form>
