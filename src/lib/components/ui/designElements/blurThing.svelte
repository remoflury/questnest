<script lang="ts">
	import { cn } from '$lib/utils/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		class?: string;
		durationInMs?: number;
	};

	let { class: className, durationInMs = 30000, ...restProps }: Props = $props();
</script>

<span
	role="presentation"
	class={cn('opacity-50 blur-2xl', className)}
	style="--duration:{durationInMs}ms"
	data-parent
	{...restProps}
>
	<span class="block h-20 w-48 rounded-br-3xl rounded-tl-full bg-primary" data-blob></span>
</span>

<style>
	* {
		animation-iteration-count: infinite;
	}

	span[data-blob] {
		animation-duration: var(--duration);
		animation-name: rotate;
		animation-timing-function: linear;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		20% {
			transform: rotate(45deg) scale(1.5) skew(40deg) translateY(40px);
		}
		60% {
			transform: skew(20deg) scale(1.3) translateX(50px);
		}
		80% {
			transform: translateY(-10px);
		}
		100% {
			transform: rotate(360deg) skew(-10deg);
		}
	}
</style>
