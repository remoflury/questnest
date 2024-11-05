import type { Actions, PageServerLoad } from "./$types.js";
import { signupSchema } from "$lib/validation/schema.js";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
 
export const load: PageServerLoad = async () => {
 return {
  signUpForm: await superValidate(zod(signupSchema)),
 };
};

export const actions: Actions = {
  signup: async ({ request }) => {
    const form = await superValidate(request, zod(signupSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    return { form}
  }
};