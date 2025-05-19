<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { onMount } from 'svelte';

	type Props = HTMLAttributes<HTMLElement> & {
		// eslint-disable-next-line
		tag?: keyof HTMLElementTagNameMap;
		// eslint-disable-next-line
		options?: IntersectionObserverInit;
		delayInMs?: number;
		href?: string;
		from?: From;
	};
	type From = 'left' | 'right' | 'top' | 'bottom';
	type AnimationClass = {
		from: string;
		to: string;
	};

	const animationClasses: Record<From, AnimationClass> = {
		left: {
			from: '-translate-x-12 opacity-0 lg:-translate-x-24',
			to: 'translate-x-0 opacity-100'
		},
		right: {
			from: 'translate-x-12 opacity-0 lg:translate-x-24',
			to: 'translate-x-0 opacity-100'
		},
		top: {
			from: '-translate-y-12 opacity-0 lg:-translate-y-24',
			to: 'translate-y-0 opacity-100'
		},
		bottom: {
			from: 'translate-y-12 opacity-0 lg:translate-y-24',
			to: 'translate-y-0 opacity-100'
		}
	};

	let {
		tag = 'div',
		options = {
			root: null, // Use the viewport
			rootMargin: '0px',
			threshold: 0.1 // Trigger when 10% of the element is visible
		},
		delayInMs = 0,
		href = undefined,
		from = 'bottom',
		class: className,
		children,
		...restProps
	}: Props = $props();

	let isVisible = $state(false);
	const random = crypto.randomUUID();

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					isVisible = true;
					observer.disconnect(); // Stop observing once the animation is triggered
				}
			});
		}, options);

		const element = document.getElementById(`intersector-${random}`);
		if (element) observer.observe(element);

		return () => {
			if (element) observer.unobserve(element);
		};
	});
</script>

<svelte:element
	this={tag}
	id="intersector-{random}"
	class="transition-all duration-700 {className} {isVisible
		? animationClasses[from!].to
		: animationClasses[from!].from}"
	style:transition-delay="{delayInMs}ms"
	{href}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
