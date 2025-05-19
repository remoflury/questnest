<script lang="ts">
	import { deleteQuestboardSchema, type DeleteQuestboardSchema } from '$lib/validation/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	type Props = {
		data: SuperValidated<Infer<DeleteQuestboardSchema>>;
		action: string;
		showDialog: boolean;
	};

	let { data, action, showDialog = $bindable(false) }: Props = $props();

	let form = superForm(data, {
		validators: zodClient(deleteQuestboardSchema),
		dataType: 'json',
		onUpdate: async ({ result }) => {
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
		}
	});

	let { enhance, delayed } = form;
</script>

<AlertDialog.Root bind:open={showDialog}>
	<AlertDialog.Content class="rounded-md">
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your this questboard with all its
				quests and remove the corresponding data from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<form method="POST" use:enhance {action} class="flex w-full items-center gap-x-4 space-y-0">
				<AlertDialog.Cancel type="button" class="w-full justify-self-stretch" variant="destructive"
					>Cancel</AlertDialog.Cancel
				>
				<Form.Button
					loading={$delayed}
					disabled={$delayed}
					class="!mt-0 w-full justify-self-stretch">Delete</Form.Button
				>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
