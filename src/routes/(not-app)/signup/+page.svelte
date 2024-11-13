<script lang="ts">
	import SignupForm from '$lib/components/form/signupForm.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Seo from '$lib/components/general/seo.svelte';

	let { data } = $props();
</script>

<Seo pageSeo={data.seo} />
<FadeInWrapper class="section-spacing container" tag="section">
	<h1>Sign Up</h1>
	<SignupForm data={data.signUpForm} action="?/signup" />
</FadeInWrapper>
