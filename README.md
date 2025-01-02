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

You may also want to define, which schema should be used:
```shell
supabase db diff -f <file-name> --schema <schema-name>
```

Then apply the migration:
```shell
supabase db push
```

### Developing with the Stripe CLI
To locally test webhooks of stripe, you can use the stripe cli. First, login with your stripe account:
```shell
stripe login
```

Then forward each event:
```shell
stripe listen --forward-to localhost:5173/api/stripe-webhook/redirect
```

Optionally, you can trigger events with the stripe cli, e.g. when a product is updated:
```shell
stripe trigger product.updated
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

