import { PUBLIC_URL } from "$env/static/public";
import type { SeoProps } from "$lib/types/GeneralTypes";



export const getSeo = (uri: string, seoPageTitle?: string, seoPageDescription?: string) => {

  const page = seoData.find((page) => page.uri === uri)
  if (!page) {
    // If the page isn't found, return default SEO properties
    return defaultSeoValues;
  }

   // Merge default SEO properties with the current page's properties
   let seo = {
      ...defaultSeoValues,
      ...page
   }

   if (seoPageTitle) {
    seo = { ...seo, ...{seoPageTitle}}
   }

   if (seoPageDescription) {
    seo = { ...seo, ...{seoPageDescription}}
   }

   return seo;

}

const genImageUrl = (relPath: string) => {
  return PUBLIC_URL + relPath
}

const defaultSeoValues: SeoProps = {
  seoPageTitle: "QuestNest",
  seoPageDescription: "The ultimate app for unforgettable moments with friends. Create custom bingo cards, filled with challenges and dares designed by your group, and see who can check off the most!",
  seoKeywords: "game, bingo, friends, group, app, challenges",
  ogTitle: "QuestNest",
  ogDescription: "The ultimate app for unforgettable moments with friends. Create custom bingo cards, filled with challenges and dares designed by your group, and see who can check off the most!",
  ogImage: genImageUrl("/assets/chicken.svg"),
}

const seoData: (SeoProps & { uri: string })[] = [
  {
    uri: "home",
    seoPageTitle: "Home",
    seoPageDescription: "The ultimate app for unforgettable moments with friends. Create custom bingo cards, filled with challenges and dares designed by your group, and see who can check off the most!",
  },
  {
    uri: "/signin",
    seoPageTitle: "Sign in",
    seoPageDescription: "Sign in into the ultimate app for unforgettable bingo moments with friends.",
    seoKeywords: "game, bingo, friends, group, app, challenges, Sign in",
    ogImage: genImageUrl("/assets/chicken.svg")
  },
  {
    uri: "/signup",
    seoPageTitle: "Sign up",
    seoPageDescription: "Sign up for the ultimate app for unforgettable bingo moments with friends.",
    seoKeywords: "game, bingo, friends, group, app, challenges, Sign up",
    ogImage: genImageUrl("/assets/chicken.svg")
  },
  {
    uri: "/quests",
    seoPageTitle: "Quests",
    seoPageDescription: "All of your quest boards in one place.",
    ogImage: genImageUrl("/assets/chicken.svg")
  },
  {
    uri: "/quests/[id]",
    seoPageTitle: "Placeholder",
    seoPageDescription: "All of your quest boards in one place.",
    ogImage: genImageUrl("/assets/chicken.svg")
  },
  {
    uri: "/quests/[id]/create",
    seoPageTitle: "Create a new questboard",
    seoPageDescription: "Create a new questboard.",
    ogImage: genImageUrl("/assets/chicken.svg")
  },
  {
    uri: "/quests/[id]/edit",
    seoPageTitle: "Placeholder",
    seoPageDescription: "Edit your current questboard.",
    ogImage: genImageUrl("/assets/chicken.svg")
  },
  {
    uri: "/settings",
    seoPageTitle: "Settings",
    seoPageDescription: "Edit your profile, change your email or password.",
    ogImage: genImageUrl("/assets/chicken.svg")
  },
]