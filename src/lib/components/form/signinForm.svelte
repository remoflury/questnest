<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { signinSchema, type SigninSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '../ui/input';
	import Button from '../ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let { data, action }: { data: SuperValidated<Infer<SigninSchema>>; action: string } = $props();

	let form = superForm(data, {
		validators: zodClient(signinSchema),
		dataType: 'json',
		onUpdate: async ({ result }) => {
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
			await goto('/');
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
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.password} type="password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button loading={$delayed} disabled={$delayed}>Sign In</Form.Button>
	<Button variant="link" href="/signup" size="sm" class="mt-2 block px-0 opacity-50">
		Don't have an account? Sign up here.
	</Button>
</form>
