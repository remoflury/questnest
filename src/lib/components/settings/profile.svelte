<script lang="ts">
	import type { Tables } from '$lib/types/SupabaseTypes';
	import type { EditProfileSchema } from '$lib/validation/schema';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import { fly } from 'svelte/transition';
	import EditProfileForm from '../form/editProfileForm.svelte';
	import ProfileInfos from './profileInfos.svelte';

	type Props = {
		user: Pick<Tables<'user'>, 'id' | 'username' | 'email' | 'avatar_path'>;
		edit: boolean;
		editProfileForm: SuperValidated<Infer<EditProfileSchema>>;
		action: string;
	};

	let { user, edit = $bindable(false), editProfileForm, action }: Props = $props();
</script>

<article class="grid-content grid-spacing">
	{#if !edit}
		<div class="grid-spacing grid grid-cols-subgrid" in:fly={{ ...TRANSITION_CONFIG, y: 20 }}>
			<ProfileInfos
				title="Username"
				avatarUrl={user.avatar_path}
				showAvatar={true}
				className="col-span-full">{user.username}</ProfileInfos
			>
			<ProfileInfos title="Email" className="col-span-full">{user.email}</ProfileInfos>
		</div>
	{:else}
		<div in:fly={{ ...TRANSITION_CONFIG, y: 20 }}>
			<EditProfileForm
				data={editProfileForm}
				{action}
				oncloseForm={() => (edit = false)}
				userId={user.id}
			/>
		</div>
	{/if}
</article>
