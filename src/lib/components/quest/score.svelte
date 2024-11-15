<script lang="ts">
	import { cn } from '$lib/utils/utils';

	type Props = {
		class?: string;
		classScore?: string;
		text?: string;
		score: number | string;
	};

	let { text = 'Score:', score, class: className, classScore }: Props = $props();
</script>

<small class={cn('block text-gray-400', className)}>
	{text} <em class={cn('pl-1', classScore)}>{score}</em>
</small>
