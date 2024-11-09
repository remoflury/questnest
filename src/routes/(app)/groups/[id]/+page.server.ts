import { error , fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addUserToGroupSchema, removeUserFromGroupSchema } from '$lib/validation/schema';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase }, params }) => {
	const { session } = await safeGetSession();
	if (!session) {
		error(401);
	}

	const { data: groupData, error: groupErr } = await supabase
		.from('group')
		.select('id, name')
		.eq('id', params.id)

	if (groupErr) {
		console.error({groupErr})
		error(500)
	}

	if (!groupData.length) {
		error(404)
	}

	// get all users assigned to this group
	const { data: groupUsers, error: groupUsersErr } = await supabase
		.from('user_group')
		.select(`
			user!user_group_user_fkey1(
				id,
				username
			)
			`)
		.eq('group', params.id)

	if (groupUsersErr) {
		console.error({groupUsersErr})
		error(500)
	}

	const [addUserToGroupForm, removeUserFromGroupForm] = await Promise.all([
		superValidate(zod(addUserToGroupSchema)),
		superValidate(zod(removeUserFromGroupSchema))
	])

	return {
		group: {
			id: groupData[0].id as number,
			name: groupData[0].name as string,
			users: groupUsers.flatMap(user => {return user.user}) as { id: string, username: string }[]
		},
		addUserToGroupForm,
		removeUserFromGroupForm
	};
};

export const actions: Actions = {
	addtogroup: async ({ locals: { safeGetSession, supabase }, request }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401);
		}

		const form = await superValidate(request, zod(addUserToGroupSchema))

		if (!form.valid) {
			console.error(form)
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		const { error: insertErr } = await supabase
			.from('user_group')
			.insert({
				user: form.data.user,
				group: form.data.group
			})

		if (insertErr) {
			console.error(insertErr)
			if (insertErr.code == "23505"){
				return message(form, 'User is already in group.', { status: 400 });
			}
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		return message(form, 'User added to group.');
	},

	removefromgroup: async ({ locals: { safeGetSession, supabase }, request }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401);
		}

		const form = await superValidate(request, zod(removeUserFromGroupSchema))

		if (!form.valid) {
			console.error(form)
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		const { error: deleteErr } = await supabase
			.from('user_group')
			.delete()
			.match({ user: form.data.user, group: form.data.group})

		if (deleteErr) {
			console.error(deleteErr)
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		return message(form, 'User removed from group.');
	}
};
