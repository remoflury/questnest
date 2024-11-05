<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { signupSchema, type SignupSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '../ui/input';
	import Button from '../ui/button/button.svelte';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { toast } from 'svelte-sonner';

	let { data, action }: { data: SuperValidated<Infer<SignupSchema>>; action: string } = $props();

	let form = superForm(data, {
		validators: zodClient(signupSchema),
		dataType: 'json',
		onUpdate: ({ result }) => {
			if (result.type == 'failure') toast.error(result.data.form.message);
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
	<Form.Field {form} name="password">
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
	</Form.Field>
	<Form.Button loading={$delayed} disabled={$delayed}>Sign Up</Form.Button>
	<Button variant="link" href="/signin" size="sm" class="mt-2 block px-0 opacity-50"
		>Already have an Account? Sign in here.</Button
	>
</form>
