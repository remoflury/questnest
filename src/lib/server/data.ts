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
  ogImage: genImageUrl("/icons-pwa/android-launchericon-512-512.png"),
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
  },
  {
    uri: "/signup",
    seoPageTitle: "Sign up",
    seoPageDescription: "Sign up for the ultimate app for unforgettable bingo moments with friends.",
    seoKeywords: "game, bingo, friends, group, app, challenges, Sign up",
  },
  {
    uri: "/imprint",
    seoPageTitle: "Imprint",
    seoPageDescription: "Imprint of questnest, the app for unforgettable bingo moments with friends.",
    seoKeywords: "game, bingo, friends, group, app, challenges, imprint",
  },
  {
    uri: "/privacy-policy",
    seoPageTitle: "Privacy Policy",
    seoPageDescription: "Learn more about the privacy policy of questnest, the app for unforgettable bingo moments with friends.",
    seoKeywords: "game, bingo, friends, group, app, challenges, imprint",
  },
  {
    uri: "/groups",
    seoPageTitle: "Groups",
    seoRobots: ["noindex, nofollow"],
    seoPageDescription: "All of your questnest qroups in one place.",
  },
  {
    uri: "/groups/[id]",
    seoPageTitle: "Placeholder",
    seoRobots: ["noindex, nofollow"],
    seoPageDescription: "Placeholder",
  },
  {
    uri: "/quests",
    seoPageTitle: "Quests",
    seoRobots: ["noindex, nofollow"],
    seoPageDescription: "All of your quest boards in one place.",
  },
  {
    uri: "/quests/[id]",
    seoPageTitle: "Placeholder",
    seoRobots: ["noindex, nofollow"],
    seoPageDescription: "All of your quest boards in one place.",
  },
  {
    uri: "/quests/[id]/create",
    seoPageTitle: "Create a new questboard",
    seoRobots: ["noindex, nofollow"],
    seoPageDescription: "Create a new questboard.",
  },
  {
    uri: "/quests/[id]/edit",
    seoPageTitle: "Placeholder",
    seoRobots: ["noindex, nofollow"],
    seoPageDescription: "Edit your current questboard.",
  },
  {
    uri: "/settings",
    seoPageTitle: "Settings",
    seoRobots: ["noindex, nofollow"],
    seoPageDescription: "Edit your profile, change your email or password.",
  },
]