import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSeo } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	return {
		seo: getSeo('home')
	};
};

export const actions: Actions = {
	signout: async ({ locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (!session) {
			// if user is not logged in, user can not be logged out
			return fail(401);
		}

		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(500);
		}

		redirect(301, '/');
	}
};
