<script>
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Cubicle from './cubicle.svelte';
</script>

<span class="pointer-events-none absolute inset-0 -z-50 m-2" role="presentation">
	<FadeInWrapper from="right">
		<Cubicle class="absolute right-0 top-52" />
	</FadeInWrapper>
</span>
