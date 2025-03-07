alter table "public"."user_group" drop constraint "user_group_user_fkey";

alter table "public"."user_group" drop constraint "user_group_user_fkey1";

create table "public"."plan" (
    "id" bigint generated by default as identity not null,
    "stripe_price_id" text not null,
    "active" boolean not null,
    "created_at" timestamp with time zone not null default now(),
    "stripe_product_id" text not null
);


alter table "public"."plan" enable row level security;

CREATE UNIQUE INDEX plan_pkey ON public.plan USING btree (id);

CREATE UNIQUE INDEX plan_stripe_price_id_key ON public.plan USING btree (stripe_price_id);

CREATE UNIQUE INDEX plan_stripe_product_id_key ON public.plan USING btree (stripe_product_id);

alter table "public"."plan" add constraint "plan_pkey" PRIMARY KEY using index "plan_pkey";

alter table "public"."plan" add constraint "plan_stripe_price_id_key" UNIQUE using index "plan_stripe_price_id_key";

alter table "public"."plan" add constraint "plan_stripe_product_id_key" UNIQUE using index "plan_stripe_product_id_key";

alter table "public"."user_group" add constraint "user_group_user_fkey" FOREIGN KEY ("user") REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_group" validate constraint "user_group_user_fkey";

alter table "public"."user_group" add constraint "user_group_user_fkey1" FOREIGN KEY ("user") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_group" validate constraint "user_group_user_fkey1";

create or replace view "public"."questboard_users" as  SELECT qb.id AS questboard_id,
    g.id AS group_id,
    u.id AS user_id,
    u.username,
    u.email,
    u.score
   FROM (((questboard qb
     JOIN "group" g ON ((qb."group" = g.id)))
     JOIN user_group ug ON ((g.id = ug."group")))
     JOIN "user" u ON ((ug."user" = u.id)));


grant delete on table "public"."plan" to "anon";

grant insert on table "public"."plan" to "anon";

grant references on table "public"."plan" to "anon";

grant select on table "public"."plan" to "anon";

grant trigger on table "public"."plan" to "anon";

grant truncate on table "public"."plan" to "anon";

grant update on table "public"."plan" to "anon";

grant delete on table "public"."plan" to "authenticated";

grant insert on table "public"."plan" to "authenticated";

grant references on table "public"."plan" to "authenticated";

grant select on table "public"."plan" to "authenticated";

grant trigger on table "public"."plan" to "authenticated";

grant truncate on table "public"."plan" to "authenticated";

grant update on table "public"."plan" to "authenticated";

grant delete on table "public"."plan" to "service_role";

grant insert on table "public"."plan" to "service_role";

grant references on table "public"."plan" to "service_role";

grant select on table "public"."plan" to "service_role";

grant trigger on table "public"."plan" to "service_role";

grant truncate on table "public"."plan" to "service_role";

grant update on table "public"."plan" to "service_role";

create policy "Enable read for all active plans"
on "public"."plan"
as permissive
for select
to public
using ((active = true));



