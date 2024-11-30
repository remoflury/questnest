import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { changePwSchema, editProfileSchema } from '$lib/validation/schema';
import { getSeo } from '$lib/server/data';
import { decode, encode } from 'base64-arraybuffer';
import type { ACCEPTED_IMAGE_TYPES } from '$lib/utils/constants';
import type { PricingPlan } from '$lib/types/StripeTypes';
import type { ApiResponse } from '$lib/types/GeneralTypes';

export const load: PageServerLoad = async ({ fetch, locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		error(401);
	}

	const { data: userData, error: userErr } = await supabase
		.from('user')
		.select('*')
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
					name: userData.avatar_path! as string,
					fileBase64: encode(await avatarBlob.arrayBuffer())
				}
			: undefined,
	}

	const getPricingPlan = async() => {
		const res = await fetch('/api/pricing-plans')
		const { payload, status, message }: ApiResponse<{
			mergedPlans: PricingPlan[], 
			usersPlanId: number
		}> = await res.json()

		if (status >= 400) {
			console.error({status, message })
			error(status)
		}
		return payload
	}

	const [editProfileForm, editPasswordForm, pricingPlanData] = await Promise.all([
		superValidate(populatedUserForm, zod(editProfileSchema)),
		superValidate(zod(changePwSchema)),
		getPricingPlan()
	]);

	return {
		user: userData,
		editProfileForm,
		editPasswordForm,
		plans: pricingPlanData.mergedPlans,
    usersPlanId: pricingPlanData.usersPlanId,
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

		// Destructure the avatar and region key out and use the rest operator to capture the remaining properties
		const { avatar, ...formData } = form.data;
		// const get previous avatar path, so that the previous can be later deleted
		const { data: prevAvatarData, error: prevAvatarErr } = await supabase
			.from('user')
			.select('avatar_path')
			.eq('id', session.user.id)

		if (prevAvatarErr) {
			console.error({ prevAvatarErr})
			return message(form, 'Something went wrong. Try again later.', { status: 500 })
		}

		// update user
		const { error: authErr } = await supabase.auth.updateUser({
			email: form.data.email
		});
		if (authErr) {
			console.error({ authErr });
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		// delete the old avatar first
		if (prevAvatarData.length && prevAvatarData[0].avatar_path) {

			const { error: deleteErr } = await supabase
			.storage
			.from('avatar')
			.remove([prevAvatarData[0].avatar_path])
			
			if (deleteErr) {
				console.error({deleteErr})
				return message(form, 'Something went wrong. Try again later.', { status: 500 });
			}
		}

		const createAvatarPath = (path: string | undefined | null, userId: string) => {
			if (!path) return null
			if (path.includes(userId)) return path
			return `${userId}/${path}`
		}
		const { error: userErr } = await supabase
			.from('user')
			.update({
				username: formData.username,
				email: formData.email,
				avatar_path: createAvatarPath(avatar?.name, session.user.id)
			})
			.eq('id', session.user.id);

		if (userErr) {
			console.error({ userErr });
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		

		// upload avatar
		if (avatar) {
			// avatar.name.includes(session.user.id) ? avatar.name.replace(`${session.user.id}/`, '') : avatar.name
			const { error: uploadErr } = await supabase.storage
				.from('avatar')
				.upload(createAvatarPath(avatar.name, session.user.id)!, decode(avatar.fileBase64), {
					contentType: avatar.type,
					upsert: true
				});

			if (uploadErr) {
				console.error({uploadErr});
				return message(form, 'Something went wrong. Try again later.', { status: 500 });
			}
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
