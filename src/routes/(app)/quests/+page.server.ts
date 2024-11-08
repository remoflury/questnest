import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { addQuestboardSchema } from "$lib/validation/schema";
import type { Tables } from "$lib/types/SupabaseTypes";

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase }}) => {
  const { session } = await safeGetSession();
	if (!session) {
		error(401);
	}

  const { data: groupsOfUserData, error: groupsOfUserErr } = await supabase
    .from('user_group')
    .select(`
      group(
        id,
        name
      )
      `)
    .eq('user', session.user.id)

  if (groupsOfUserErr) {
    console.error(groupsOfUserErr)
    error(500)
  }
  const groupsOfUser = groupsOfUserData.flatMap((user) => {
    return user.group
  }) as (Pick<Tables<"group">, 'id' | 'name'>)[]

  const addQuestboardForm = await superValidate(zod(addQuestboardSchema))

  return {
    addQuestboardForm,
    groupsOfUser
  }
};

export const actions: Actions = {
  addquestboard: async ({ request, locals: { safeGetSession, supabase }}) => {
    const { session } = await safeGetSession()
    if (!session) {
      return fail(401)
    }

    const form = await superValidate(request, zod(addQuestboardSchema))

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
      .select('id')  

    if (insertErr) {
      console.error(insertErr)
      return message(form, 'Something went wrong. Try again later.', { status: 500 });
    }

    redirect(301, `/quests/${insertData[0].id}`)
  }
};