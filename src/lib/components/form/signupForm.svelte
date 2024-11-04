<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { signupSchema, type SignupSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '../ui/input';

	let data: SuperValidated<Infer<SignupSchema>> = $props();

	let form = superForm(data, {
		validators: zodClient(signupSchema),
		dataType: 'json'
	});

	let { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
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
	<Form.Button>Sign Up</Form.Button>
</form>
