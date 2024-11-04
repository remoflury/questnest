<script lang="ts">
	import SignupForm from '$lib/components/form/signupForm.svelte';

	let { data } = $props();

	$inspect(data);
</script>

<section>
	<h1>Sign Up</h1>
	<SignupForm data={data.signUpForm} />
</section>
