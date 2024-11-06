<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLElement> & {
		tag?: keyof HTMLElementTagNameMap;
		options?: IntersectionObserverInit;
		delayInMs?: number;
	};

	let className: $$Props['class'] = '';
	export { className as class };
	export let tag: $$Props['tag'] = 'div';
	export let delayInMs: $$Props['delayInMs'] = 0;
	export let options: $$Props['options'] = {
		root: null, // Use the viewport
		rootMargin: '0px',
		threshold: 0.1 // Trigger when 10% of the element is visible
	};

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
	class="transition-all duration-700 {className}"
	class:not-visible={!isVisible}
	class:is-visible={isVisible}
	id="intersector-{random}"
	style:transition-delay="{delayInMs}ms"
	{...$$restProps}
	on:click
>
	<slot />
</svelte:element>

<style lang="postcss">
	.not-visible {
		@apply translate-y-12 opacity-0 lg:translate-y-24;
	}
	.is-visible {
		@apply translate-y-0 opacity-100;
	}
</style>
