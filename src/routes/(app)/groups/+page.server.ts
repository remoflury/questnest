import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { fail, message, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addGroupSchema } from '$lib/validation/schema';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		error(401);
	}

	// get groups related to user
	const { data: groupData, error: groupErr } = await supabase
		.from('group')
		.select('id, name')

	if (groupErr) {
		console.error({groupErr});
		error(500);
	}

	const addGroupForm = await superValidate(zod(addGroupSchema));
	return {
		addGroupForm,
		groups: groupData
	};
};

export const actions: Actions = {
	addgroup: async ({ locals: { safeGetSession, supabase }, request }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401);
		}

		const form = await superValidate(request, zod(addGroupSchema));

		if (!form.valid) {
			return message(form, 'Something went wrong. Try again.', { status: 400 });
		}

		const { data: groupData, error: groupErr } = await supabase
			.from('group')
			.insert({ name: form.data.name })
			.select('id');

		if (groupErr) {
			console.log('groupErr', groupErr);
			return message(form, 'Something went wrong. Try again.', { status: 500 });
		}

		// n:m relationship of current user and newly created group will be inserted via trigger function in supabase
		// ========
		/**
     * -- Create the trigger function to auto-insert the user into the group
        CREATE OR REPLACE FUNCTION add_creator_to_user_group()
        RETURNS TRIGGER AS $$
        DECLARE
            user_id uuid;
        BEGIN
            -- Get the ID of the currently authenticated user
            user_id := auth.uid();

            -- Insert a new entry into user_group with the current user and the new group
            INSERT INTO user_group ("user", "group")
            VALUES (user_id, NEW.id);

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
     */

		/**
     * -- Create the trigger that calls the function after a new group is inserted
    CREATE TRIGGER add_user_to_group_after_insert
    AFTER INSERT ON "group"
    FOR EACH ROW
    EXECUTE FUNCTION add_creator_to_user_group();
  */
		setMessage(form, `${form.data.name} saved succesfully`);

		redirect(301, `/groups/${groupData[0].id}`);
	}
};
