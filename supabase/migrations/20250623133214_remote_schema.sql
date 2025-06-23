CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER sync_users_trigger AFTER UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION sync_public_users();


grant delete on table "storage"."s3_multipart_uploads" to "postgres";

grant insert on table "storage"."s3_multipart_uploads" to "postgres";

grant references on table "storage"."s3_multipart_uploads" to "postgres";

grant select on table "storage"."s3_multipart_uploads" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads" to "postgres";

grant update on table "storage"."s3_multipart_uploads" to "postgres";

grant delete on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant insert on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant references on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant select on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant update on table "storage"."s3_multipart_uploads_parts" to "postgres";

create policy "Allow access to Logos 1peuqw_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'logos'::text));


create policy "Landlords can delete images in their own folder"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'listing-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Landlords can insert images in their own folders"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'listing-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Landlords can update images in their own folders"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'listing-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])))
with check (((bucket_id = 'listing-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Landlords can view images in their own folders"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'listing-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Tenants can view all listing images"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'listing-images'::text) AND (EXISTS ( SELECT 1
   FROM (users
     JOIN roles ON ((roles.id = users.role_id)))
  WHERE ((users.id = auth.uid()) AND (roles.name = 'tenant'::text))))));


create policy "full access 1oj01fe_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'avatars'::text));


create policy "full access 1oj01fe_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'avatars'::text));


create policy "full access 1oj01fe_2"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'avatars'::text))
with check ((bucket_id = 'avatars'::text));



