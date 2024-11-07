<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus } from 'lucide-svelte';
	import { Badge } from '../ui/badge';
	import Button from '../ui/button/button.svelte';

	let {
		username,
		userUid,
		isAlreadyInGroup,
		action
	}: { username: string; userUid: string; isAlreadyInGroup: boolean; action: string } = $props();
</script>

<svelte:element
	this={isAlreadyInGroup ? 'div' : 'form'}
	class="flex justify-between"
	use:enhance
	method={isAlreadyInGroup ? undefined : 'POST'}
	action={isAlreadyInGroup ? undefined : action}
>
	<small>{username}</small>
	{#if !isAlreadyInGroup}
		<Button
			type="submit"
			class="!aspect-square h-6 w-6 p-2"
			title="add {username} to group"
			aria-label="add {username} to group"
		>
			<Plus />
		</Button>
	{/if}
</svelte:element>
