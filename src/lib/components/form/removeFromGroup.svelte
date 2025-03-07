<script lang="ts">
	import type { RemoveUserFromGroupSchema } from '$lib/validation/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	type Props = {
		userToRemove: {
			id: string;
			username: string;
		} | null;
		groupId: number;
		open: boolean;
		data: SuperValidated<Infer<RemoveUserFromGroupSchema>>;
		action: string;
		oncancel?: () => void;
		onsuccess?: () => void;
	};

	let {
		userToRemove,
		open = $bindable(),
		data,
		action,
		groupId,
		oncancel,
		onsuccess
	}: Props = $props();

	let form = superForm(data, {
		onSubmit: ({ formData }) => {
			if (!userToRemove) return;
			formData.set('user', userToRemove.id);
			formData.set('group', groupId.toString());
		},
		onUpdate: ({ result }) => {
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
			onsuccess?.();
		}
	});

	let { enhance, delayed } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title
				>Are you sure you want to remove {userToRemove?.username} from the group?</Dialog.Title
			>
			<Dialog.Description></Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="gap-y-2">
			<Button type="button" variant="destructive" onclick={oncancel}>Cancel</Button>
			<form method="POST" use:enhance {action}>
				<Button
					type="submit"
					class="!mt-0 w-full"
					variant="default"
					loading={$delayed}
					disabled={$delayed}>Remove</Button
				>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
