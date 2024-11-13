import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createQuestsSchema } from '$lib/validation/schema';
import { getSeo } from '$lib/server/data';

export const load: PageServerLoad = async ({ params, locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		error(401);
	}

	// const check if quests are already existing
	const {
		data: questsData,
		count: questCount,
		error: questsErr
	} = await supabase
		.from('quest')
		.select('id, text', { count: 'exact', head: false })
		.eq('questboard', params.id);

	if (questsErr) {
		console.error({ questsErr });
		error(500);
	}

	if (!!questCount === false) {
		// redirect, if no quests are available
		return redirect(307, `/quests/${params.id}`);
	}

	// get questboard credentials
	const { data: questboardData, error: questboardErr } = await supabase
		.from('questboard')
		.select('name')
		.eq('id', params.id)
		.single();

	if (questboardErr) {
		console.error({ questboardErr });
		error(500);
	}

	const prepopulatedData = {
		questboard: parseInt(params.id),
		quests: questsData
	};

	const editQuestsForm = await superValidate(prepopulatedData, zod(createQuestsSchema));

	return {
		questboard: questboardData,
		editQuestsForm,
		seo: getSeo("/quests/[id]/edit", `Edit: ${questboardData.name}`)
	};
};

export const actions: Actions = {
	editquests: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401);
		}

		const form = await superValidate(request, zod(createQuestsSchema));
		console.log(form.data);

		if (!form.valid) {
			console.error(form);
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		const updateData = form.data.quests.map((quest) => {
			return {
				id: quest.id!,
				questboard: form.data.questboard,
				text: quest.text
			};
		});

		const { error: updateErr } = await supabase.from('quest').upsert(updateData);

		if (updateErr) {
			console.error({ updateErr });
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		return message(form, 'Quests updated successfully.');
	}
};
