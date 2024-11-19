<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { cn } from '$lib/utils/utils';
	import { mode } from 'mode-watcher';
	import { setMode } from 'mode-watcher';

	type Props = HTMLAttributes<HTMLDivElement> & {
		id: string;
	};

	let { class: className, id }: Props = $props();
	let checked = $state($mode == 'light');

	$effect(() => {
		if (checked) setMode('dark');
		if (!checked) setMode('light');
	});
</script>

<div class={cn('flex items-center space-x-2', className)}>
	<Label for={id}>Light Mode</Label>
	<Switch {id} bind:checked />
	<Label for={id}>Dark Mode</Label>
</div>
