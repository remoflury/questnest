import { getSeo } from "$lib/server/data";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {
    seo: getSeo("/imprint")
  }
};