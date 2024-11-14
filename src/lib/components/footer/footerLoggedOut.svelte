<script lang="ts">
	import { footer as footerStore } from '$lib/store/store';
	import Button from '../ui/button/button.svelte';

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

<footer
	bind:clientHeight={$footerStore.footerHeight}
	class="grid-content grid-spacing container bg-secondary py-4"
>
	<strong class="font-dm-serif">QuestNest</strong>

	{#if footerLinks.length}
		<ul>
			{#each footerLinks as link}
				<li>
					<Button
						class="p-0"
						href={link.href}
						aria-label="go to {link.label}"
						title="go to {link.label}"
						variant="link"
					>
						{link.label}
					</Button>
				</li>
			{/each}
		</ul>
	{/if}
	<small class="font-dm-serif">© {year} QuestNest</small>
</footer>
