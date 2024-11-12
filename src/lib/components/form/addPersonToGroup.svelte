<script lang="ts">
	import type { AddUserToGroupSchema } from '$lib/validation/schema';
	import { Plus, Check } from 'lucide-svelte';
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import Badge from '../ui/badge/badge.svelte';
	import Button from '../ui/button/button.svelte';

	type Props = {
		username: string;
		groupId: number;
		userUid: string;
		isAlreadyInGroup: boolean;
		action: string;
		data: SuperValidated<Infer<AddUserToGroupSchema>>;
	};

	let { username, groupId, userUid, isAlreadyInGroup, action, data }: Props = $props();

	let form = superForm(data, {
		id: crypto.randomUUID(),
		onSubmit: ({ formData }) => {
			formData.set('group', groupId.toString());
			formData.set('user', userUid);
		},
		onUpdate: ({ result }) => {
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
		}
	});

	let { enhance, delayed } = form;
</script>

{#snippet content(isAlreadyInGroup: boolean)}
	<small>{username}</small>
	{#if !isAlreadyInGroup}
		<Button
			type="submit"
			class="!mt-0 !aspect-square h-6 w-6 p-2"
			title="add {username} to group"
			aria-label="add {username} to group"
			disabled={$delayed}
			loading={$delayed}
		>
			{#if !$delayed}
				<Plus />
			{/if}
		</Button>
	{:else}
		<Badge variant="outline" class="!aspect-square h-6 w-6 p-1 font-normal"><Check /></Badge>
	{/if}
{/snippet}

{#if isAlreadyInGroup}
	<div class="flex items-center justify-between">
		{@render content(isAlreadyInGroup)}
	</div>
{:else}
	<form {action} use:enhance method="POST" class="flex items-center justify-between">
		{@render content(isAlreadyInGroup)}
	</form>
{/if}
