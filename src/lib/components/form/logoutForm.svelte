<script lang="ts">
	import { enhance } from '$app/forms';
	import { LogOut } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import type { ButtonVariant } from '../ui/button';
	import { cn } from '$lib/utils/utils';

	type Props = {
		variant?: ButtonVariant;
		className?: string;
	};

	let { variant = 'default', className }: Props = $props();
</script>

<form
	action="/?/signout"
	method="POST"
	use:enhance
	aria-label="Logout"
	title="Logout"
	class={cn(className)}
>
	<Button class="!aspect-square p-2" type="submit" {variant}>
		<LogOut />
	</Button>
</form>
