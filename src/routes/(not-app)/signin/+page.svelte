<script lang="ts">
	import SigninForm from '$lib/components/form/signinForm.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Seo from '$lib/components/general/seo.svelte';

	let { data } = $props();
</script>

<Seo pageSeo={data.seo} />
<FadeInWrapper class="section-spacing container" tag="section">
	<h1>Sign In</h1>
	<SigninForm data={data.signinForm} action="?/signin" />
</FadeInWrapper>
