import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addQuestboardSchema } from '$lib/validation/schema';
import type { Tables } from '$lib/types/SupabaseTypes';
import { getSeo } from '$lib/server/data';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		error(401);
	}

	// get groups of user
	const { data: groupsOfUser, error: groupsOfUserErr } = await supabase
		.from('group')
		.select('id, name');

	if (groupsOfUserErr) {
		console.error({ groupsOfUserErr });
		error(500);
	}

	// get all quests of user
	const { data: questboards, error: questboardsError } = await supabase
		.from('questboard')
		.select(
			`
        id,
        name,
        description,
        group(
          name
        )
      `
		)
		.returns<
			(Pick<Tables<'questboard'>, 'id' | 'name' | 'description'> & {
				group: Pick<Tables<'group'>, 'name'>;
			})[]
		>();

	if (questboardsError) {
		console.error({ questboardsError });
		error(500);
	}

	const addQuestboardForm = await superValidate(zod(addQuestboardSchema));

	return {
		addQuestboardForm,
		groupsOfUser,
		questboards,
		seo: getSeo("/quests")
	};
};

export const actions: Actions = {
	addquestboard: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401);
		}

		const form = await superValidate(request, zod(addQuestboardSchema));

		if (!form.valid) {
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		const { data: insertData, error: insertErr } = await supabase
			.from('questboard')
			.insert({
				name: form.data.name,
				description: form.data.description ?? form.data.description,
				group: parseInt(form.data.group)
			})
			.select('id');

		if (insertErr) {
			console.error({insertErr});
			const errorCodes = ["P0001", "P0002", "P0003"]
			const errorMsg = errorCodes.includes(insertErr.code) ? insertErr.message : 'Something went wrong. Try again later.'
			return message(form, errorMsg, { status: 500 });
		}

		redirect(301, `/quests/${insertData[0].id}`);
	}
};
