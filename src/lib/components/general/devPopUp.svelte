<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	type Props = {
		open: boolean;
	};

	let { open = $bindable() }: Props = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Important Information</AlertDialog.Title>
			<AlertDialog.Description>
				This site is still under construction and may not function as expected. Only use if you're
				certain and expecting bugs aswell as dataloss to occur.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action onclick={() => (open = false)}>I have understood.</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
