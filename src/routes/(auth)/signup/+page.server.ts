import { signupSchema } from "$lib/validation/schema.js";
import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
 
export const load: PageServerLoad = async () => {
 return {
  signUpForm: await superValidate(zod(signupSchema)),
 };
};