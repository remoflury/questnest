import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { editProfileSchema } from "$lib/validation/schema";

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase }}) => {
  const { session } = await safeGetSession()
  if (!session) {
    error(401)
  }

  const { data: userData, error: userErr } = await supabase
    .from('user')
    .select('username, email')
    .eq('id', session.user.id)
    .single()

  if (userErr) {
    console.error({userErr})
    error(500)
  }

  const editProfileForm = await superValidate(userData, zod(editProfileSchema))

  return {
    user: userData,
    editProfileForm
  }
};

export const actions: Actions = {
  editprofile: async ({ request, locals: { safeGetSession, supabase }}) => {
    const { session } = await safeGetSession()
    if (!session) {
      return fail(401)
    }

    const form = await superValidate(request, zod(editProfileSchema))

    if (!form.valid) {
      console.error({form})
      return message(form, 'Something went wrong. Try again later.', { status: 400 })
    }

    console.log(form)

    // check if new credentials already exist
    const { data: alreadyTakenData, error: alreadyTakenErr } = await supabase
      .from('user')
      .select('username, email')
      .or(`email.eq.${form.data.email},username.eq.${form.data.username}`);

    if (alreadyTakenErr) {
      console.error({alreadyTakenErr})
      return message(form, 'Something went wrong. Try again later.', { status: 500 })
    }

    // TODO: what if user only updates one of both values? 
    if (alreadyTakenData.length) {
      if (alreadyTakenData[0].email == form.data.email) {
				setError(form, 'email', `User with email ${form.data.email} already exists.`);
			}
			if (alreadyTakenData[0].username == form.data.username) {
				setError(form, 'username', `User with username ${form.data.username} already exists.`);
			}
			return message(form, 'Email or Username are already taken, please try other', { status: 403 });
    }

    // update user
    const { error: authErr } = await supabase.auth.updateUser({
      email: form.data.email
    })
    if (authErr) {
      console.error({authErr})
      return message(form, 'Something went wrong. Try again later.', { status: 500 })
    }

    const { error: userErr } = await supabase
      .from('user')
      .update({
        username: form.data.username,
        email: form.data.email
      })
      .eq('id', session.user.id)

    if (userErr) {
      console.error({userErr})
      return message(form, 'Something went wrong. Try again later.', { status: 500 })
    }

    return message(form, 'Profile updated successfully')
  }
};