import type { Actions, PageServerLoad } from './$types.js';
import { signupSchema } from '$lib/validation/schema.js';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { getSeo } from '$lib/server/data.js';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		redirect(307, '/quests');
	}
	return {
		signUpForm: await superValidate(zod(signupSchema)),
		seo: getSeo('/signup')
	};
};

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(signupSchema));
		if (!form.valid) {
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		// check if user already exists
		const { data: user, error: userErr } = await supabase
			.from('user')
			.select('email, username')
			.or(`email.eq.${form.data.email},username.eq.${form.data.username}`);

		if (userErr) {
			console.error(userErr);
			return message(form, userErr.message, { status: 400 });
		}

		if (user.length) {
			if (user[0].email == form.data.email) {
				setError(form, 'email', `User with email ${form.data.email} already exists.`);
			}
			if (user[0].username == form.data.username) {
				setError(form, 'username', `User with username ${form.data.username} already exists.`);
			}
			return message(form, 'Something went wrong.', { status: 400 });
		}

		const { data, error: signupErr } = await supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password
		});
		if (signupErr) {
			console.error({ signupErr });
			if (signupErr?.code == 'user_already_exists') {
				setError(form, 'email', 'User with this email already exists.');
				return message(form, 'User with this email already exists.', { status: 400 });
			}

			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}

		const { error: insertErr } = await supabase.from('user').insert({
			id: data.user!.id,
			username: form.data.username,
			email: form.data.email
		});

		if (insertErr) {
			console.error(insertErr);
			return message(form, 'Something went wrong. Try again later.', { status: 400 });
		}
		return message(form, 'You registered successfully.');
	}
};
