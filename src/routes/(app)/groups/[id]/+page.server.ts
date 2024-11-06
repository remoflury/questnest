import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase }, params}) => {
  const { session } = await safeGetSession()
  if (!session) {
    error(401)
  }

  // TODO: replace with RLS!
  const { data, error: groupErr} = await supabase 
    .from('user_group')
    .select(`
      group(
        id,
        name
      )
      `)
    .eq('user', session.user.id)
    .eq('group.id', params.id)

  if (groupErr) {
    console.error(groupErr)
    error(500)
  }

  const group = data.filter(row => row.group).map(row => {
    return {
      // @ts-expect-error wrong generated sb-types
      id: row.group.id,
      // @ts-expect-error wrong generated sb-types
      name: row.group.name
    }
  })

  if (!group.length) {
    error(404)
  }

  return {
    group: group[0]
  }

};