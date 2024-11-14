<script lang="ts">
	import { cn } from '$lib/utils/utils';

	type Props = {
		class?: string;
		durationInMs?: number;
		widthInRem?: number;
	};
	let { class: className, durationInMs = 20000, widthInRem = 4 }: Props = $props();
</script>

<div
	role="presentation"
	class={cn('grid place-content-center rounded-sm border border-secondary', className)}
	data-first
	style="--duration: {durationInMs}ms; --width: {widthInRem}rem;"
>
	<div
		class="-z-10 m-auto grid h-6 w-6 place-content-center rounded-sm border border-secondary"
		data-second
	>
		<div class=" m-auto h-4 w-4 rounded-sm border border-secondary" data-third></div>
	</div>
</div>

<style>
	div {
		animation-iteration-count: infinite;
	}
	div[data-first] {
		animation-duration: var(--duration);
		animation-name: first;
		width: var(--width);
		height: var(--width);
	}
	div[data-second] {
		animation-duration: calc(var(--duration) / 2);
		animation-name: second;
		animation-delay: 100;
		width: calc(var(--width) * 0.75);
		height: calc(var(--width) * 0.75);
	}
	div[data-third] {
		animation-duration: calc(var(--duration) / 3);
		animation-name: third;
		animation-delay: 200;
		width: calc(var(--width) * 0.5);
		height: calc(var(--width) * 0.5);
	}

	@keyframes first {
		0% {
			transform: rotate(6deg);
		}

		50% {
			transform: rotate(366deg);
		}

		100% {
			transform: rotate(6deg);
		}
	}
	@keyframes second {
		0% {
			transform: rotate(-60deg);
		}

		50% {
			transform: rotate(300deg);
		}

		100% {
			transform: rotate(-60deg);
		}
	}
	@keyframes third {
		0% {
			transform: rotate(30deg);
		}

		50% {
			transform: rotate(390deg);
		}

		100% {
			transform: rotate(30deg);
		}
	}
</style>
