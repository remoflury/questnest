import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Tables } from "$lib/types/SupabaseTypes";

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
          name
        )
      `)
    .eq('id', params.id)
    .returns<(Pick<Tables<'questboard'>, 'id' | 'name' | 'description'> & { group: Pick<Tables<"group">, 'name'>})[]>()
    .single()

  if (questboardErr) {
    console.error({questboardErr})
    error(401)
  }

  if (!questboard) {
    error(404)
  }

  // const check if quests are already existing
  const { count: questCount, error: questsErr } = await supabase
    .from("quest")
    .select('id', { count: 'exact', head: true})
    .eq('questboard', params.id)

  if (questsErr) {
    console.error({questsErr})
    error(401)
  }
  return {
    questboard,
    questsExisting: !!questCount
  }
};