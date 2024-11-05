import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = loadFlash(async ({ locals: { safeGetSession }, cookies }) => {
  const { session } = await safeGetSession()
  return {
    session,
    cookies: cookies.getAll(),
  }
})