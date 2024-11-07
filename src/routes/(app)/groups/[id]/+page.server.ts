import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { groupUsersSchema } from '$lib/validation/schema';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase }, params }) => {
	const { session } = await safeGetSession();
	if (!session) {
		error(401);
	}

	// TODO: replace with RLS!
	const { data, error: groupErr } = await supabase
		.from('user_group')
		.select(
			`
      group(
        id,
        name
      )
      `
		)
		.eq('user', session.user.id)
		.eq('group.id', params.id);

	if (groupErr) {
		console.error(groupErr);
		error(500);
	}

	const group = data
		.filter((row) => row.group)
		.map((row) => {
			return {
				// @ts-expect-error wrong generated sb-types
				id: row.group.id,
				// @ts-expect-error wrong generated sb-types
				name: row.group.name
			};
		});

	if (!group.length) {
		error(404);
	}

	return {
		group: group[0]
	};
};

export const actions: Actions = {
	addtogroup: async ({ locals: { safeGetSession, supabase }, request }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401);
		}

		const body = await request.json();
		console.log(body);

		// const form = await superValidate(request, zod(groupUsersSchema))

		// if (!form.valid) {
		//   console.error(form)
		//   return message(form, 'Something went wrong. Try again later.', { status: 400 });
		// }

		// console.log(form)
	}
};
