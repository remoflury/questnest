import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { changePwSchema, editProfileSchema } from '$lib/validation/schema';
import { getSeo } from '$lib/server/data';
import { encode } from 'base64-arraybuffer';
import type { ACCEPTED_IMAGE_TYPES } from '$lib/utils/constants';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		error(401);
	}

	const { data: userData, error: userErr } = await supabase
		.from('user')
		.select('username, email, score, avatar_path')
		.eq('id', session.user.id)
		.single();

	if (userErr) {
		console.error({ userErr });
		error(500);
	}

	let avatarBlob: Blob | null | undefined = undefined;
	// get users avatar from supabase
	if (userData.avatar_path) {
		const { data: avatarData, error: avatarErr } = await supabase.storage
			.from('avatar')
			.download(`${userData.avatar_path}`);

		if (avatarErr) {
			console.error({avatarErr});
			return error(500);
		}

		avatarBlob = avatarData ? avatarData : undefined;
	}

	const populatedUserForm = {
		email: userData.email,
		username: userData.username,
		avatar: avatarBlob
			? {
					type: avatarBlob.type as typeof ACCEPTED_IMAGE_TYPES[number],
					name: userData.avatar_path!.replace(`${session.user.id}/`, '') as string,
					fileBase64: encode(await avatarBlob.arrayBuffer())
				}
			: undefined,

	}

	const [editProfileForm, editPasswordForm] = await Promise.all([
		superValidate(populatedUserForm, zod(editProfileSchema)),
		superValidate(zod(changePwSchema))
	]);

	return {
		user: userData,
		editProfileForm,
		editPasswordForm,
		seo: getSeo("/settings")
	};
};

export const actions: Actions = {
	editprofile: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401);
		}

		const form = await superValidate(request, zod(editProfileSchema));

		if (!form.valid) {
			console.error({ form });
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		// check if new credentials already exist (taken by other users)
		const { data: alreadyTakenData, error: alreadyTakenErr } = await supabase
			.from('user')
			.select('username, email')
			.or(`email.eq.${form.data.email},username.eq.${form.data.username}`)
			.neq('id', session.user.id);

		if (alreadyTakenErr) {
			console.error({ alreadyTakenErr });
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		if (alreadyTakenData.length) {
			if (alreadyTakenData[0].email == form.data.email) {
				setError(form, 'email', `User with email already exists.`);
			}
			if (alreadyTakenData[0].username == form.data.username) {
				setError(form, 'username', `User with username already exists.`);
			}
			return message(form, 'Email or Username are already taken, please try other', {
				status: 403
			});
		}

		// update user
		const { error: authErr } = await supabase.auth.updateUser({
			email: form.data.email
		});
		if (authErr) {
			console.error({ authErr });
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		const { error: userErr } = await supabase
			.from('user')
			.update({
				username: form.data.username,
				email: form.data.email
			})
			.eq('id', session.user.id);

		if (userErr) {
			console.error({ userErr });
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		return message(form, 'Profile updated successfully');
	},
	changepw: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401);
		}

		const form = await superValidate(request, zod(changePwSchema));

		if (!form.valid) {
			console.error({ form });
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		// Re-authenticate the user by signing them in again with the current password
		const { error: signInErr } = await supabase.auth.signInWithPassword({
			email: session.user.email!,
			password: form.data.currentPassword
		});

		if (signInErr) {
			console.error({ signInErr });
			if (signInErr.code == 'invalid_credentials') {
				setError(form, 'currentPassword', 'Invalid password.');
				return message(form, 'Please use your correct current password.', { status: 403 });
			}
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		// If re-authentication is successful, proceed to update the password
		const { error: updateErr } = await supabase.auth.updateUser({
			password: form.data.newPassword
		});

		if (updateErr) {
			console.error({ updateErr });
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		return message(form, 'Password updated successfully.');
	}
};
