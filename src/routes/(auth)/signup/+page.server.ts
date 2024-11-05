import type { Actions, PageServerLoad } from "./$types.js";
import { signupSchema } from "$lib/validation/schema.js";
import { message, setError, superValidate } from "sveltekit-superforms";
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
      console.error("eeeerr", error)
      if (error.code == 'user_already_exists') {
        setFlash({ type: "error", message: "User with this email already exists."}, cookies)
        setError(form, 'email', "User with this email already exists.")
        return message(form, "User with this email already exists.", { status: 400 })
      }
      
      setFlash({ type: 'error', message: 'Something went wrong. Try again later.' }, cookies);
      return message(form, "Something went wrong. Try again later.", { status: 400 })
    }
    redirect('/signin', { type: 'error', message: "Succesfully signed up." }, cookies);
  }
};