import { genApiRes } from '$lib/utils/utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { safeGetSession, supabase }, url }) => {
	const { session } = await safeGetSession();
	if (!session) {
		return genApiRes(undefined, undefined, 401);
	}

	const q = url.searchParams.get('q') || null;

	const sbQuery = supabase.from('user').select('*');

	if (q) {
		sbQuery.or(`username.ilike.%${q}%, email.ilike.%${q}%`);
	}

	const { data: users, error: usersErr } = await sbQuery;
	if (usersErr) {
		console.error(usersErr);
		return genApiRes(undefined, usersErr.message, 500);
	}

	return genApiRes({ users });
};
