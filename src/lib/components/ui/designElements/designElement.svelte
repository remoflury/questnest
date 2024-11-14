<script>
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Cubicle from './cubicle.svelte';
	import PoppingCubes from './poppingCubes.svelte';
</script>

<span class="pointer-events-none absolute inset-0 -z-50 m-2" role="presentation">
	<FadeInWrapper from="right" class="absolute inset-0 h-full w-full">
		<Cubicle class="absolute right-0 top-40" />
	</FadeInWrapper>
	<!-- <FadeInWrapper from="left" class="absolute inset-0 h-full w-full">
		<PoppingCubes class="absolute left-1/2 top-80 -translate-x-1/2" width="80%" />
	</FadeInWrapper> -->
</span>
