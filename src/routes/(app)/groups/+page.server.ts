import type { Actions, PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { addGroupSchema } from "$lib/validation/schema";

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
  const { session } = await safeGetSession()
  if (!session) {
    error(401)
  }

  const addGroupForm = await superValidate(zod(addGroupSchema))
  return {
    addGroupForm
  }
};

export const actions: Actions = {
  addgroup: async ({ locals: { safeGetSession, supabase }, request}) => {
    const { session } = await safeGetSession()
    if (!session) {
      return fail(401)
    }

    const form = await superValidate(request, zod(addGroupSchema))

    if (!form.valid) {
      return message(form, 'Something went wrong. Try again.', { status: 400 });
    }

    const { data: groupData, error: groupErr } = await supabase
      .from('group')
      .insert({name: form.data.name})
      .select('id')

    if (groupErr) {
      console.log(groupErr)
      return message(form, 'Something went wrong. Try again.', { status: 500 });
    }

    const { error: userGroupErr } = await supabase
      .from('user_group')
      .insert({
        group: groupData[0].id,
        user: session.user.id
      })
    
    if (userGroupErr) {
      console.log(userGroupErr)
      return message(form, 'Something went wrong. Try again.', { status: 500 });
    }

    return message(form, `${form.data.name} saved succesfully.`);
  }
};