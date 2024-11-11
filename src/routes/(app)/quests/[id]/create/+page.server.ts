import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createQuestsSchema } from "$lib/validation/schema";
import { QUESTS_PER_BOARD } from "$lib/utils/constants";

export const load: PageServerLoad = async ({ params, locals: { safeGetSession, supabase }}) => {
  const { session } = await safeGetSession();
	if (!session) {
		error(401);
	}

	 // const check if quests are already existing
	const { count: questCount, error: questsErr } = await supabase
		.from("quest")
		.select(`*`, { count: "exact", head: true })
		.eq('questboard', params.id)

 if (questsErr) {
	 console.error({questsErr})
	 error(500)
 }

 // get questboard credentials
 const { data: questboardData, error: questboardErr } = await supabase
		.from("questboard")
		.select("name")
		.eq('id', params.id)
		.single()

 if (questboardErr) {
	 console.error({questboardErr})
	 error(500)
 }

 console.log(!!questCount)

//  TODO: entcomment
//  if (!!questCount === true) {
// 	// redirect, if quests are available
// 	return redirect(307, `/quests/${params.id}`)
//  }
const prepopulatedData = { 
	questboard: parseInt(params.id),
	quests: Array.from({ length: QUESTS_PER_BOARD}).map((_, i) => {
		return {
			// id: i + 1,
			text: `Quest ${i + 1}`
		}
	})
}
const createQuestsForm = await superValidate(prepopulatedData, zod(createQuestsSchema))

 return {
	questboard: questboardData,
	createQuestsForm
 }
};

export const actions: Actions = {
	createquests: async ({ request, locals: { safeGetSession, supabase }}) => {
		const { session } = await safeGetSession()
		if (!session) {
			return fail(401)
		}

		const form = await superValidate(request, zod(createQuestsSchema))

		if (!form.valid) {
			console.error(form)
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		const insertData = form.data.quests.map((quest) => {
			return {
				questboard: form.data.questboard,
				text: quest.text
			}
		})

		const { error: insertErr } = await supabase
			.from('quest')
			.insert(insertData)

		if (insertErr) {
			console.error({insertErr});
			return message(form, insertErr.message, { status: 400 });
		}

		return message(form, 'Quests saved successfully.');
	}
};