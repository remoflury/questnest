<script lang="ts">
	import { signupSchema, type SignupSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	let { data, action }: { data: SuperValidated<Infer<SignupSchema>>; action: string } = $props();

	let form = superForm(data, {
		validators: zodClient(signupSchema),
		dataType: 'json',
		onUpdate: async ({ result }) => {
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
			setTimeout(async () => {
				await goto('/signin');
			}, 1000);
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
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password <sup>*</sup></Form.Label>
				<Input
					{...props}
					bind:value={$formData.password}
					type="password"
					{...$constraints.password}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="passwordConfirm">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm password <sup>*</sup></Form.Label>
				<Input
					{...props}
					bind:value={$formData.passwordConfirm}
					type="password"
					{...$constraints.passwordConfirm}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button loading={$delayed} disabled={$delayed}>Sign Up</Form.Button>
	<Button variant="link" href="/signin" size="sm" class="mt-2 block px-0 opacity-50">
		Already have an account? Sign in here.
	</Button>
</form>
