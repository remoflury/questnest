alter table "public"."user" add column "score" numeric not null default '0'::numeric;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_score()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment score on quest completion
    UPDATE "user"
    SET score = score + 1 -- equals to user id of inserted row in table qeust_done
    WHERE id = NEW.user;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement score on quest removal
    UPDATE "user"
    SET score = score - 1
    WHERE id = OLD.user; -- equals to user id of deleted row in table qeust_done
  END IF;
  RETURN NULL; -- Triggers don't return rows
END;
$function$
;

CREATE TRIGGER update_user_score_trigger AFTER INSERT OR DELETE ON public.quest_done FOR EACH ROW EXECUTE FUNCTION update_user_score();


