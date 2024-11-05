import type { Actions, PageServerLoad } from "./$types.js";
import { signupSchema } from "$lib/validation/schema.js";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { setFlash } from "sveltekit-flash-message/server";
import { redirect } from "sveltekit-flash-message/server";
 
export const load: PageServerLoad = async () => {
 return {
  signUpForm: await superValidate(zod(signupSchema)),
 };
};

export const actions: Actions = {
  signup: async ({ request, cookies, locals: { supabase } }) => {
    const form = await superValidate(request, zod(signupSchema));
    if (!form.valid) {
      setFlash({ type: 'error', message: 'Something went wrong. Try again later.' }, cookies);
      return message(form, "Something went wrong. Try again later.", { status: 400 })
    }

    const { error } = await supabase.auth.signUp({
      email: form.data.email,
      password: form.data.password
    })

    if (error) {
      console.error(error)
      setFlash({ type: 'error', message: 'Something went wrong. Try again later.' }, cookies);
      return message(form, "Something went wrong. Try again later.", { status: 400 })
    }
    redirect('/signin', { type: 'error', message: "Succesfully signed up." }, cookies);
  }
};