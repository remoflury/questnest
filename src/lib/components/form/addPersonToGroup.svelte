<script lang="ts">
	import type { AddUserToGroupSchema } from '$lib/validation/schema';
	import type { Tables } from '$lib/types/SupabaseTypes';
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { Plus, Check } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { getPublicSbUrl } from '$lib/utils/fileUtils';
	import Badge from '../ui/badge/badge.svelte';
	import Button from '../ui/button/button.svelte';
	import Score from '../quest/score.svelte';
	import * as Avatar from '$lib/components/ui/avatar';

	type Props = {
		user: Tables<'user'>;
		groupId: number;
		isAlreadyInGroup: boolean;
		action: string;
		data: SuperValidated<Infer<AddUserToGroupSchema>>;
	};

	let { user, groupId, isAlreadyInGroup, action, data }: Props = $props();

	let form = superForm(data, {
		id: crypto.randomUUID(),
		onSubmit: ({ formData }) => {
			formData.set('group', groupId.toString());
			formData.set('user', user.id);
		},
		onUpdate: ({ result }) => {
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
		}
	});

	let { enhance, delayed } = form;
</script>

{#snippet content(isAlreadyInGroup: boolean)}
	<div class="flex items-center justify-between">
		<div class="flex items-start gap-x-4">
			<Avatar.Root class="border border-secondary">
				{#if user.avatar_path}
					<Avatar.Image
						src={getPublicSbUrl($page.data.supabase, 'avatar', user.avatar_path, {
							width: 100,
							height: 100
						})}
						alt="profile avatar of {user.username}"
					/>
				{/if}
				<Avatar.Fallback>{user.username.slice(0, 2).toUpperCase()}</Avatar.Fallback>
			</Avatar.Root>
			<div>
				<small>{user.username}</small>
				<Score score={user.score} />
			</div>
		</div>
		{#if !isAlreadyInGroup}
			<Button
				type="submit"
				class="!mt-0 !aspect-square h-6 w-6 p-2"
				title="add {user.username} to group"
				aria-label="add {user.username} to group"
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
	</div>
{/snippet}

{#if isAlreadyInGroup}
	<div class="-space-y-1">
		{@render content(isAlreadyInGroup)}
	</div>
{:else}
	<form {action} use:enhance method="POST" class="-space-y-1">
		{@render content(isAlreadyInGroup)}
	</form>
{/if}
