<script>
	import { enhance } from '$app/forms';
	import { LogOut } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
</script>

<form action="/?/signout" method="POST" use:enhance aria-label="Logout" title="Logout">
	<Button class="!aspect-square p-2" type="submit">
		<LogOut />
	</Button>
</form>
