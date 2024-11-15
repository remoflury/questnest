<script lang="ts">
	import type { HeadingTypes } from '$lib/types/GeneralTypes.js';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Seo from '$lib/components/general/seo.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';

	let { data } = $props();
</script>

<Seo pageSeo={data.seo} />

{#snippet title(title: string, tag?: HeadingTypes, className?: string)}
	<TitleWrapper {tag} class={className}>
		{#snippet text()}
			{title}
		{/snippet}
	</TitleWrapper>
{/snippet}

<FadeInWrapper tag="section" class="section-t-spacing container">
	{@render title('Imprint', 'h1', 'mb-0')}
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('Disclaimer')}
		<p>
			The author assumes no liability for the correctness, accuracy, timeliness, reliability and
			completeness of the information.
		</p>
		<br />
		<p>
			The author assumes no liability for the correctness, accuracy, timeliness, reliability and
			completeness of the information.
		</p>
		<br />
		<p>
			All offers are subject to change. The author expressly reserves the right to change, add to or
			delete parts of the pages or the entire offer without prior notice, or to temporarily or
			permanently stop publication.
		</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('Disclaimer for content and links')}
		<p>
			References and links to third-party websites are outside our area of ​​responsibility. We
			reject any responsibility for such websites. Access and use of such websites is at the user's
			own risk.
		</p>
	</article>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<article>
		{@render title('Copyright statement')}
		<p>
			The copyright and all other rights to content, images, photos or other files on this website
			belong exclusively to QuestNest or the specifically named rights holders. For the reproduction
			of any elements, the written consent of the copyright holder must be obtained in advance.
		</p>
		<br />
		<small><a href="https://brainbox.swiss/" target="_blank">Source: BrainBox Solutions</a></small>
	</article>
</FadeInWrapper>
