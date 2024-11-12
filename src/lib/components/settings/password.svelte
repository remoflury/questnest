<script lang="ts">
	import type { Tables } from '$lib/types/SupabaseTypes';
	import type { ChangePwSchema } from '$lib/validation/schema';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import ProfileInfos from './profileInfos.svelte';
	import { fly } from 'svelte/transition';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import ChangePwForm from '../form/changePwForm.svelte';

	type Props = {
		edit: boolean;
		editPwForm: SuperValidated<Infer<ChangePwSchema>>;
		action: string;
	};

	let { edit = $bindable(false), editPwForm, action }: Props = $props();
</script>

<article class="grid-content grid-spacing">
	{#if !edit}
		<div class="grid-spacing grid grid-cols-subgrid" in:fly={{ ...TRANSITION_CONFIG, y: 20 }}>
			<ProfileInfos title="Password" text="******" />
		</div>
	{:else}
		<div in:fly={{ ...TRANSITION_CONFIG, y: 20 }}>
			<ChangePwForm data={editPwForm} {action} oncloseForm={() => (edit = false)} />
		</div>
	{/if}
</article>
