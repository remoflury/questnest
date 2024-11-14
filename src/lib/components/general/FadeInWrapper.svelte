<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLElement> & {
		tag?: keyof HTMLElementTagNameMap;
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
	// const from: From = 'bottom';

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

	let className: $$Props['class'] = '';
	export { className as class };
	export let tag: $$Props['tag'] = 'div';
	export let delayInMs: $$Props['delayInMs'] = 0;
	export let href: $$Props['href'] = undefined;
	export let options: $$Props['options'] = {
		root: null, // Use the viewport
		rootMargin: '0px',
		threshold: 0.1 // Trigger when 10% of the element is visible
	};
	export let from: $$Props['from'] = 'bottom';

	let isVisible = false;
	let random = Math.random();

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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
	this={tag}
	class="transition-all duration-700 {className} {isVisible
		? animationClasses[from!].to
		: animationClasses[from!].from}"
	id="intersector-{random}"
	style:transition-delay="{delayInMs}ms"
	{href}
	{...$$restProps}
	on:click
>
	<slot />
</svelte:element>
