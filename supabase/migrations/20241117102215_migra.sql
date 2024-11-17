drop policy "Enable read access for all users" on "public"."questboard";

create policy "Enable Delete for questboards of users group"
on "public"."questboard"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_group
  WHERE ((user_group."user" = auth.uid()) AND (user_group."group" = questboard."group")))));


create policy "Enable read access for users groups questboards"
on "public"."questboard"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_group
  WHERE ((user_group."user" = auth.uid()) AND (user_group."group" = questboard."group")))));


create policy "Enable update for questboards of users groups"
on "public"."questboard"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_group
  WHERE ((user_group."user" = auth.uid()) AND (user_group."group" = questboard."group")))))
with check ((EXISTS ( SELECT 1
   FROM user_group
  WHERE ((user_group."user" = auth.uid()) AND (user_group."group" = questboard."group")))));



