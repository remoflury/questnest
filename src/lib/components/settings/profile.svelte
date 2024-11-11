<script lang="ts">
	import type { Tables } from '$lib/types/SupabaseTypes';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import EditProfileForm from '../form/editProfileForm.svelte';
	import FadeInWrapper from '../general/FadeInWrapper.svelte';
	import type { EditProfileSchema } from '$lib/validation/schema';
	import ProfileInfos from './profileInfos.svelte';
	import { fly } from 'svelte/transition';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';

	type Props = {
		user: Pick<Tables<'user'>, 'username' | 'email'>;
		edit: boolean;
		editProfileForm: SuperValidated<Infer<EditProfileSchema>>;
		action: string;
	};

	let { user, edit = $bindable(false), editProfileForm, action }: Props = $props();
</script>

<article class="grid-content grid-spacing">
	{#if !edit}
		<div class="grid-spacing grid grid-cols-subgrid" in:fly={{ ...TRANSITION_CONFIG, y: 20 }}>
			<ProfileInfos title="Username" text={user.username} className="col-span-full" />
			<ProfileInfos title="Email" text={user.email} className="col-span-full" />
		</div>
	{:else}
		<div in:fly={{ ...TRANSITION_CONFIG, y: 20 }}>
			<EditProfileForm data={editProfileForm} {action} oncloseForm={() => (edit = false)} />
		</div>
	{/if}
</article>
