<script lang="ts">
	import { cn } from '$lib/utils/utils';

	type Props = {
		message: string;
		error?: string;
		status?: number;
		className?: string;
	};
	let { message, error, status, className }: Props = $props();
</script>

<p class={cn('rounded-lg bg-destructive px-4 py-2 text-background', className)}>
	{message}
	{#if error}
		<br />
		<code class="text-xs">{status ? `${status}: ` : ''}{error}</code>
	{/if}
</p>
