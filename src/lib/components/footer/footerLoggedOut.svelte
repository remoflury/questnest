<script lang="ts">
	import { footer as footerStore } from '$lib/store/store';
	import Button from '../ui/button/button.svelte';
	import Separator from '../ui/separator/separator.svelte';

	const year = new Date().getFullYear();

	let footerLinks = [
		{
			label: 'Imprint',
			href: '/imprint'
		},
		{
			label: 'Privacy Policy',
			href: '/privacy-policy'
		}
	];
</script>

<footer bind:clientHeight={$footerStore.footerHeight} class="section-t-spacing">
	<Separator />
	<article class="grid-content grid-spacing container py-4">
		<strong class="font-dm-serif lg:col-span-2 xl:col-span-4">QuestNest</strong>

		{#if footerLinks.length}
			<ul
				class="gap-x-4 lg:col-span-6 lg:-col-end-1 lg:row-start-2 lg:flex lg:items-start lg:justify-end"
			>
				{#each footerLinks as link}
					<li>
						<Button
							class="p-0"
							href={link.href}
							aria-label="go to {link.label}"
							title="go to {link.label}"
							variant="link"
							size="sm"
						>
							{link.label}
						</Button>
					</li>
				{/each}
			</ul>
		{/if}
		<small class="flex items-center font-dm-serif lg:col-span-2 lg:row-start-2 xl:col-span-4"
			>© {year} QuestNest</small
		>
	</article>
</footer>
