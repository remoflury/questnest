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

	/**
	 * @function parseEmail
	 * @description
	 * Encyrpts the first part of the email
	 * and returns the encrypted email
	 * @param email - The email to encrypt
	 * @returns The encrypted email
	 */
	const parseEmail = (email: string): string => {
		const [firstPart, secondPart] = email.split('@');
		const fillFirst = '*'.repeat(firstPart.length - 1);
		const tld = secondPart.split('.').pop();
		const secondPartWithoutTld = secondPart.slice(0, secondPart.length - tld.length - 1);
		const fillSecond = '*'.repeat(secondPartWithoutTld.length - 1);
		return `${firstPart.slice(0, 1)}${fillFirst}@${secondPartWithoutTld.slice(0, 1)}${fillSecond}.${tld}`;
	};
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
			<ProfileInfos title="Email" className="col-span-full">{parseEmail(user.email)}</ProfileInfos>
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
