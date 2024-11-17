import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { deleteQuestboardSchema, editQuestsSchema } from '$lib/validation/schema';
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
		.select('name, description')
		.eq('id', params.id)
		.single();

	if (questboardErr) {
		console.error({ questboardErr });
		error(500);
	}

	const prepopulatedData = {
		questboardId: parseInt(params.id),
		name: questboardData.name,
		description: questboardData.description,
		quests: questsData
	};

	// const editQuestsForm = await superValidate(prepopulatedData, zod(editQuestsSchema));

	const [editQuestsForm, deleteQuestboardForm] = await Promise.all([
		await superValidate(prepopulatedData, zod(editQuestsSchema)),
		await superValidate({questboardId: parseInt(params.id)}, zod(deleteQuestboardSchema))
	])



	return {
		questboard: questboardData,
		editQuestsForm,
		deleteQuestboardForm,
		seo: getSeo("/quests/[id]/edit", `Edit: ${questboardData.name}`)
	};
};

export const actions: Actions = {
	editquests: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401);
		}

		const form = await superValidate(request, zod(editQuestsSchema));

		if (!form.valid) {
			console.error(form);
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		const updateQuestsData = form.data.quests.map((quest) => {
			return {
				id: quest.id!,
				questboard: form.data.questboardId,
				text: quest.text
			};
		});

		const { error: updateQuestsErr } = await supabase
			.from('quest')
			.upsert(updateQuestsData);
		
		if (updateQuestsErr) {
			console.error({ updateQuestsErr });
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		const { error: updateQuestboardErr } = await supabase
			.from('questboard')
			.update({
				name: form.data.name,
				description: form.data.description ? form.data.description : null
			})
			.eq("id", form.data.questboardId)
			.select('name, description')


		if (updateQuestboardErr) {
			console.error({ updateQuestboardErr });
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		return message(form, 'Quests updated successfully.');
	},
	deletequestboard: async ({ request, locals: { safeGetSession, supabase }}) => {
		const { session} = await safeGetSession()
		if (!session) {
			return fail(401);
		}

		const form = await superValidate(request, zod(deleteQuestboardSchema))

		console.log(form)
		if (!form.valid) {
			console.error(form);
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		const { error: deleteErr } = await supabase
			.from('questboard')
			.delete()
			.eq('id', form.data.questboardId)

		if (deleteErr) {
			console.error({deleteErr})
			return message(form, "Something went wrong. Try again later.", {status: 500})
		}

		redirect(301, "/quests")
	}
};
