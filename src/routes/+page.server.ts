import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
  // const { session } = await safeGetSession()
  // if (session) {
  //   console.log(session)
  //   // redirect(300, '/quests')
  // }
};