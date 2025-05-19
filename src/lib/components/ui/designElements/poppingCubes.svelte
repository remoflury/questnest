<script lang="ts">
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import { cn } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	type Props = {
		width?: string;
		durationInMs?: number;
		class?: string;
	};

	type Pos = {
		x: number;
		y: number;
	};

	let { width = '10rem', class: className }: Props = $props();
	const constMaxSquares = 4;

	let ref: HTMLDivElement | undefined = $state();
	let squares: Pos[] = $state([]);

	// Generates random positions within the div
	const getRandomPosition = (maxWidth: number, maxHeight: number, margin: number): Pos => {
		const x = Math.random() * (maxWidth - 2 * margin) + margin;
		const y = Math.random() * (maxHeight - 2 * margin) + margin;
		return { x, y };
	};

	// Initialize squares with random positions
	const createSquare = (ref: HTMLDivElement) => {
		const { offsetWidth, offsetHeight } = ref;
		return getRandomPosition(offsetWidth, offsetHeight, 10);
		// squares = Array.from({ length: squareCount }, () =>
		// 	getRandomPosition(offsetWidth, offsetHeight, 10)
		// );
	};

	onMount(() => {
		// squares = Array.from({ length: squareCount }, () => createSquare(ref!));
		const interval = setInterval(() => {
			if (squares.length >= constMaxSquares) squares.shift();
			squares.push(createSquare(ref!));
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div
	class={cn('block aspect-square w-[var(--width)] border border-primary', className)}
	style={`
    --width: ${width};
  `}
	data-parent
	bind:this={ref}
>
	{#each squares as square (crypto.randomUUID())}
		<!-- animate:flip={{ duration: 200 }} -->
		<div
			transition:scale={TRANSITION_CONFIG}
			class="absolute h-4 w-4 rounded-md bg-primary"
			style={`
        left: ${square.x}px;
        top: ${square.y}px;
      `}
			data-square
		></div>
	{/each}
</div>

<style>
</style>
