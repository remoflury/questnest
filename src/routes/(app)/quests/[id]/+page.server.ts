import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { Tables } from "$lib/types/SupabaseTypes";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { toggleQuestSchema } from "$lib/validation/schema";

export const load: PageServerLoad = async ({ params, locals: { safeGetSession, supabase }}) => {
  const { session } = await safeGetSession();
	if (!session) {
		error(401);
	}

  const { data: questboard, error: questboardErr } = await supabase
    .from('questboard')
    .select(`
        id,
        name,
        description,
        group(
          id,
          name
        ),
        quest(
          id,
          text
        )
      `)
    .eq('id', params.id)
    .returns<(
      Pick<Tables<'questboard'>, 'id' | 'name' | 'description'> & 
      { group: Pick<Tables<"group">, 'id' | 'name'>} &
      { quest: Pick<Tables<"quest">, 'id' | 'text'>[]}
    )[]>()
    .single()

  if (questboardErr) {
    console.error({questboardErr})
    error(500)
  }

  if (!questboard) {
    error(404)
  }

  const allQuestIds = questboard.quest.map((q) => {
    return q.id
  })

  // get all completed quests of current user
  const { data: questsCompleted, error: questsCompletedErr } = await supabase
    .from('quest_done')
    .select('quest')
    .in('quest', allQuestIds)
    .eq('user', session.user.id)
    // .returns<Pick<Tables<"user_accessible_quests">, "quest_id">[]>()

  if (questsCompletedErr) {
    console.error({questsCompletedErr})
    error(500)
  }

  const questIdsCompleted = questsCompleted.map((q) => {
    return q.quest as number
  })

  const { count: countOtherMembers, error: groupMembersErr } = await supabase
    .from('user_group')
    .select('*', { head: true, count: "exact"})
    .eq('group', questboard.group.id)
    .neq('user', session.user.id)

  if (groupMembersErr) {
    console.error({groupMembersErr})
    error(500)
  }

  const toggleQuestForm = await superValidate(zod(toggleQuestSchema))

  return {
    questboard,
    toggleQuestForm,
    questIdsCompleted,
    countOtherMembers: countOtherMembers as number
  }
};

export const actions: Actions = {
  togglequest: async ({ request, locals: { safeGetSession, supabase }}) => {
    const { session } = await safeGetSession()
    if (!session) {
      return fail(401)
    }

    const form = await superValidate(request, zod(toggleQuestSchema))

    if (!form.valid) {
      console.error(form)
      return message(form, 'Something went wrong. Try again later.', { status: 400 });
    }

    // check if user has completed the task already
    const { count, error } = await supabase
      .from('user_accessible_quests')
      .select('*', { head: true, count: "exact"})
      .match({quest_id: form.data.id, user_id: session.user.id})

    if (error) {
      console.error({error})
      return message(form, "Something went wrong. Try again later.", { status: 500 })
    }

    // if user has not completed the task, set it as done (insert)
    if (!count) {
      const { error: insertErr } = await supabase
        .from('quest_done')
        .insert({ quest: form.data.id, user: session.user.id })

      if (insertErr) {
        console.error({insertErr})
        return message(form, "Something went wrong. Try again later.", { status: 500 })
      }

      return message(form, "Well done 🥳!")
    }

    // if user has already completed the task, set it as undone (delete)
    if (count) {
      const { error: deleteErr } = await supabase
        .from('quest_done')
        .delete()
        .match({quest: form.data.id, user: session.user.id})

      if (deleteErr) {
        console.error({deleteErr})
        return message(form, "Something went wrong. Try again later.", { status: 500 })

      }

      return message(form, "You have to be more eager 🤓!")
    }
  }
};