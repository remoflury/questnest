<script lang="ts">
	import SigninForm from '$lib/components/form/signinForm.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';

	let { data } = $props();
</script>

<FadeInWrapper class="section-spacing container" tag="section">
	<h1>Sign In</h1>
	<SigninForm data={data.signinForm} action="?/signin" />
</FadeInWrapper>
