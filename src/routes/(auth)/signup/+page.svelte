<script lang="ts">
	import SignupForm from '$lib/components/form/signupForm.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';

	let { data } = $props();
</script>

<FadeInWrapper class="container" tag="section">
	<h1>Sign Up</h1>
	<SignupForm data={data.signUpForm} action="?/signup" />
</FadeInWrapper>
