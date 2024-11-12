<script lang="ts">
	import type { Tables } from '$lib/types/SupabaseTypes';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { addQuestboardSchema, type AddQuestboardSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	type Props = {
		data: SuperValidated<Infer<AddQuestboardSchema>>;
		action: string;
		groupsOfUser: Pick<Tables<'group'>, 'id' | 'name'>[];
	};

	const groups = $derived.by(() =>
		groupsOfUser.map((group) => {
			return {
				value: group.id.toString(),
				label: group.name
			};
		})
	);

	let { data, action, groupsOfUser }: Props = $props();
	let form = superForm(data, {
		validators: zodClient(addQuestboardSchema),
		onUpdate: ({ result }) => {
			if (result.type == 'failure') return toast.error(result.data.form.message);
		}
	});

	let { form: formData, enhance, delayed, constraints } = form;

	let value: string = $state('');

	let selectedLabel = $derived(
		value ? groups.find((group) => group.value == value)?.label : 'Assign a group'
	);
</script>

<form method="POST" use:enhance {action}>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name <sup>*</sup></Form.Label>
				<Input {...props} bind:value={$formData.name} {...$constraints.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Textarea
					{...props}
					class="resize-none rounded-xl"
					bind:value={$formData.description}
					{...$constraints.description}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="group">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Group</Form.Label>
				<Select.Root
					type="single"
					bind:value={$formData.group}
					name={props.name}
					items={groups}
					onValueChange={(v) => (value = v)}
					{...$constraints.group}
				>
					<Select.Trigger {...props} data-testid="group-select">
						{selectedLabel ?? 'Assign a group'}
					</Select.Trigger>
					<Select.Content>
						{#each groups as group}
							<Select.Item value={group.value} label={group.label} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full" loading={$delayed} disabled={$delayed}>Add Quest</Form.Button>
</form>
