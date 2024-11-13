import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signinSchema } from '$lib/validation/schema';
import { redirect } from '@sveltejs/kit';
import { getSeo } from '$lib/server/data';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		redirect(307, '/quests');
	}
	return {
		signinForm: await superValidate(zod(signinSchema)),
		seo: getSeo("/signin")
	};
};

export const actions: Actions = {
	signin: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(signinSchema));

		if (!form.valid) {
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		const { error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (error) {
			console.error(error);
			return message(form, 'Something went wrong. Try again later.', { status: 500 });
		}

		return message(form, 'You logged in successfully.');
	}
};
