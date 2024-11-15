create policy "Delete for own user 1bs1gex_2"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'avatar'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Enable Select for authenticated users 1bs1gex_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'avatar'::text));


create policy "Insert for authenticated users"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'avatar'::text));


create policy "Update for own user 1bs1gex_0"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'avatar'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



