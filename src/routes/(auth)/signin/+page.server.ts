import type { Actions, PageServerLoad } from "./$types";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { signinSchema } from "$lib/validation/schema";

export const load: PageServerLoad = async () => {
  return {
		signinForm: await superValidate(zod(signinSchema))
	};
};

export const actions: Actions = {
  signin: async ({ request, locals: { supabase }}) => {
    const form = await superValidate(request, zod(signinSchema))

    if (!form.valid) {
      return message(form, 'Something went wrong. Try again later.', { status: 400 });
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password
    })

    if (error) {
      console.error(error)
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
    }

		return message(form, "You logged in successfully.")
  }
};