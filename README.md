# QuestNest
The ultimate app for unforgettable moments with friends. Create custom bingo cards, filled with challenges and dares designed by your group, and see who can check off the most.

QuestNest's Backend is built with Supabase and SvelteKit 2. It's Fronted uses Svelte 5 with TailwindCSS and ShadCN for Svelte.


## Setup 

1. Clone the repository
2. Install dependencies with 
```shell
npm install
```
3. Copy the .env.example file to .env and fill in the required values
```shell
cp .env.example .env
```


## Developing

Start the development server. This will start the local supabase cli aswell as the frontend
```shell
npm run start
```

## Pushing Local DB Changes to Remote
If you have local db changes, which should be pushed to the remote, start a migration:
```shell
supabase db diff -f <file-name>
```

Then apply the migration:
```shell
supabase db push
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

