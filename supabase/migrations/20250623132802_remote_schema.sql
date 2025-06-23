

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."listing_availability_status" AS ENUM (
    'available',
    'taken'
);


ALTER TYPE "public"."listing_availability_status" OWNER TO "postgres";


CREATE TYPE "public"."listing_payment_frequency" AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'yearly'
);


ALTER TYPE "public"."listing_payment_frequency" OWNER TO "postgres";


CREATE TYPE "public"."listing_publication_status" AS ENUM (
    'published',
    'unpublished',
    'draft'
);


ALTER TYPE "public"."listing_publication_status" OWNER TO "postgres";


CREATE TYPE "public"."listing_type" AS ENUM (
    'condo',
    'apartment',
    'room in family house',
    'basement unit'
);


ALTER TYPE "public"."listing_type" OWNER TO "postgres";


CREATE TYPE "public"."package_type" AS ENUM (
    'bronze',
    'silver',
    'gold'
);


ALTER TYPE "public"."package_type" OWNER TO "postgres";


CREATE TYPE "public"."rate_limit_endpoint" AS ENUM (
    'api/checkout',
    'api/webhook',
    'api/verify-session',
    'api/billing-portal'
);


ALTER TYPE "public"."rate_limit_endpoint" OWNER TO "postgres";


CREATE TYPE "public"."subscription_status" AS ENUM (
    'active',
    'canceled',
    'past_due',
    'trialing',
    'unpaid',
    'paused',
    'incomplete',
    'incomplete_expired'
);


ALTER TYPE "public"."subscription_status" OWNER TO "postgres";


COMMENT ON TYPE "public"."subscription_status" IS 'A list of subscription status types mirrored from Stripe.';



CREATE TYPE "public"."webhook_event_status" AS ENUM (
    'pending',
    'completed',
    'failed'
);


ALTER TYPE "public"."webhook_event_status" OWNER TO "postgres";


CREATE TYPE "public"."webhook_event_type_enum" AS ENUM (
    'charge.succeeded',
    'charge.updated',
    'checkout.session.completed',
    'customer.created',
    'customer.updated',
    'customer.deleted',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.created',
    'invoice.paid',
    'invoice.payment_succeeded',
    'invoice.finalized',
    'invoice.payment_failed',
    'payment_intent.created',
    'payment_intent.succeeded',
    'payment_intent.payment_failed'
);


ALTER TYPE "public"."webhook_event_type_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."attempt_insert_webhook_event"("p_event_id" "text", "p_event_type" "public"."webhook_event_type_enum", "p_request_id" "text") RETURNS TABLE("inserted" boolean, "status" "public"."webhook_event_status", "error" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  -- Try to insert a new webhook event
  insert into public.webhook_events (
    event_id,
    event_type,
    request_id,
    status
  )
  values (
    p_event_id,
    p_event_type,
    p_request_id,
    'pending'
  )
  returning true, 'pending'::webhook_event_status, null
  into inserted, status, error;

  return next;
  return;
  
exception
  when unique_violation then
    -- Duplicate event_id: fetch existing record
    select false, we.status, we.error
    into inserted, status, error
    from public.webhook_events we
    where we.event_id = p_event_id;

    return next;
    return;

  when others then
    -- Catch-all error handler
    inserted := false;
    status := null;
    error := sqlerrm;

    return next;
    return;
end;
$$;


ALTER FUNCTION "public"."attempt_insert_webhook_event"("p_event_id" "text", "p_event_type" "public"."webhook_event_type_enum", "p_request_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."broadcast_table_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'table_updates:' || TG_TABLE_NAME, -- topic includes table name for filtering
    TG_OP,                             -- event (INSERT, UPDATE, DELETE)
    TG_OP,                             -- operation
    TG_TABLE_NAME,                     -- table name
    TG_TABLE_SCHEMA,                   -- schema
    NEW,                               -- new record
    OLD                                -- old record
  );
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."broadcast_table_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_participant_access"("convo_id" "uuid", "pid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$BEGIN
    RETURN (
        (SELECT true WHERE auth.uid() IS NOT NULL AND auth.uid() = pid)
        OR
        EXISTS (
            SELECT 1 
            FROM public.conversation_participants cp
            WHERE cp.conversation_id = convo_id  -- This is the parameter
            AND cp.user_id = auth.uid()
            AND cp.deleted_at IS NULL -- To check if the user is still an active participant of the conversation.
        )
    );
END;$$;


ALTER FUNCTION "public"."check_participant_access"("convo_id" "uuid", "pid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_password_match"("user_id" "uuid", "new_password" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$declare
    stored_hash text;
begin
    set search_path = 'public';
    select encrypted_password into stored_hash
    from auth.users
    where id = user_id;

    if stored_hash is null then
        return false;  -- User not found
    end if;

    return crypt(new_password, stored_hash) = stored_hash;
end;$$;


ALTER FUNCTION "public"."check_password_match"("user_id" "uuid", "new_password" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_user_existence"("user_email_address" "text") RETURNS TABLE("user_id" "uuid", "user_email" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT id, email::text  -- Cast email to text
    FROM auth.users
    WHERE email = user_email_address;
END;
$$;


ALTER FUNCTION "public"."check_user_existence"("user_email_address" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_conversation"("initiator_id" "uuid", "recipient_id" "uuid") RETURNS TABLE("conversation_id" "uuid", "is_new_conversation" boolean, "was_deleted" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$ 
DECLARE active_conversation_id uuid;

BEGIN -- Prevent users from creating conversations with themselves
IF initiator_id = recipient_id THEN RAISE EXCEPTION 'Cannot create a conversation with yourself';

END IF;

IF (
    SELECT
        COUNT(*)
    FROM
        users
    WHERE
        id IN (initiator_id, recipient_id)
) < 2 THEN RAISE EXCEPTION 'One or both users do not exist';

END IF;

SELECT
    cp1.conversation_id INTO active_conversation_id
FROM
    conversation_participants cp1
    JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
    JOIN conversations c ON c.id = cp1.conversation_id
WHERE
    (
        (
            cp1.user_id = initiator_id
            AND cp2.user_id = recipient_id
        )
        OR (
            cp1.user_id = recipient_id
            AND cp2.user_id = initiator_id
        )
    )
    AND c.deleted_at IS NULL FOR
UPDATE
;

IF active_conversation_id IS NULL THEN
INSERT INTO
    conversations (id)
VALUES
    (gen_random_uuid()) RETURNING id INTO active_conversation_id;

BEGIN
INSERT INTO
    conversation_participants (conversation_id, user_id)
VALUES
    (active_conversation_id, initiator_id),
    (active_conversation_id, recipient_id);

EXCEPTION
WHEN OTHERS THEN
DELETE FROM
    conversations
WHERE
    id = active_conversation_id;

RAISE EXCEPTION 'Failed to create conversation participants: %',
SQLERRM;

END;

RETURN QUERY
SELECT
    active_conversation_id,
    true,
    false;

ELSE RETURN QUERY
SELECT
    active_conversation_id,
    false,
    EXISTS (
        SELECT
            1
        FROM
            conversation_participants cp
        WHERE
            cp.conversation_id = active_conversation_id
            AND cp.user_id = initiator_id
            AND cp.deleted_at IS NOT NULL
    );

END IF;

EXCEPTION
WHEN OTHERS THEN RAISE NOTICE 'Error in create_conversation: %',
SQLERRM;

RAISE EXCEPTION 'Failed to create conversation: %',
SQLERRM;

END;

$$;


ALTER FUNCTION "public"."create_conversation"("initiator_id" "uuid", "recipient_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."evaluate_rate_limit"("p_user_id" "text", "p_endpoint" "public"."rate_limit_endpoint", "p_max_attempts" integer, "p_window_hours" integer) RETURNS TABLE("allowed" boolean, "remaining_attempts" integer, "reset_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_current_attempts int;
  v_reset_at timestamptz;
  v_now timestamptz := timezone('UTC', now());
  v_new_reset_at timestamptz := v_now + make_interval(hours => p_window_hours);
begin
  -- Validate inputs
  if p_max_attempts <= 0 or p_window_hours <= 0 then
    raise exception 'Invalid input: p_max_attempts and p_window_hours must be positive';
  end if;
  
  -- Lock row to prevent race conditions
  select r.attempts, r.reset_at
  into v_current_attempts, v_reset_at
  from rate_limits r
  where r.user_id = p_user_id and r.endpoint = p_endpoint
  for update;

  -- if attempts are null or reset_at is null, reset both
  if v_current_attempts is null or v_reset_at is null then
    v_current_attempts := 0;
    v_reset_at := v_now;
  end if;

  -- If no record or expired window, reset to 1 attempt
  if not found or v_reset_at <= timezone('UTC', now()) then
    insert into rate_limits (user_id, endpoint, attempts, reset_at, updated_at)
    values (p_user_id, p_endpoint, 1, v_new_reset_at, v_now)
    on conflict (user_id, endpoint)
    do update set
      attempts = 1,
      reset_at = v_new_reset_at,
      updated_at = v_now;

    allowed := true;
    remaining_attempts := greatest(p_max_attempts - 1, 0);
    reset_at := v_new_reset_at;
    return next;
    return;
  end if;

  -- If limit already exceeded
  if v_current_attempts >= p_max_attempts then
    allowed := false;
    remaining_attempts := 0;
    reset_at := v_reset_at;
    return next;
    return;
  end if;

  -- Otherwise, increment attempts
  update rate_limits 
  set 
    attempts = attempts + 1,
    updated_at = v_now
  where user_id = p_user_id and endpoint = p_endpoint;

  allowed := true;
  remaining_attempts := greatest(p_max_attempts - v_current_attempts - 1, 0);
  reset_at := v_reset_at;
  return next;
  

  exception when others then
  -- Log error (consider loggging to a table or logging system)
  -- insert into rate_limit_errors (user_id, endpoint, error_message, occurred_at)
  -- values (p_user_id, p_endpoint, sqlerrm, v_now);

  raise notice 'Error in evaluate_rate_limit: %', sqlerrm;

  allowed := false;
  remaining_attempts := 0;
  reset_at := coalesce(v_reset_at, v_now);
  return next;
end;
$$;


ALTER FUNCTION "public"."evaluate_rate_limit"("p_user_id" "text", "p_endpoint" "public"."rate_limit_endpoint", "p_max_attempts" integer, "p_window_hours" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_conversations_for_user"("pid" "uuid") RETURNS TABLE("conversation_id" "uuid", "created_at" timestamp with time zone, "deleted_at" timestamp with time zone, "updated_at" timestamp with time zone, "participants" "jsonb", "last_message" "text", "last_message_sent_at" timestamp with time zone, "last_message_sender_id" "uuid", "unread_count" bigint)
    LANGUAGE "plpgsql"
    AS $$BEGIN
  RETURN QUERY

  SELECT
    -- Conversation metadata
    c.id AS conversation_id,
    c.created_at,
    c.deleted_at,
    c.updated_at,

    -- Aggregate participants into a JSON array (excluding current user)
    jsonb_agg(
      jsonb_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'full_name', u.full_name,
        'email', u.email,
        'role_id', u.role_id,
        'avatar_url', u.avatar_url
      )
    ) AS participants,

    -- Last message content
    (
      SELECT m.content
      FROM public.messages m
      WHERE m.conversation_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) AS last_message,

    -- When last message was sent
    (
      SELECT m.created_at
      FROM public.messages m
      WHERE m.conversation_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) AS last_message_sent_at,

    -- Sender of the last message (NULL if it was you)
    (
      SELECT CASE
        WHEN m.sender_id != pid THEN m.sender_id
        ELSE NULL
      END
      FROM public.messages m
      WHERE m.conversation_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) AS last_message_sender_id,

    -- Count of messages sent by *others* since *you* last read
    (
      SELECT COUNT(*)
      FROM public.messages m2
      JOIN public.conversation_participants cp2
        ON cp2.conversation_id = m2.conversation_id
       AND cp2.user_id = pid
      WHERE m2.conversation_id = c.id
        AND m2.sender_id   != pid                            -- only messages from the other user
        AND m2.created_at  > COALESCE(cp2.last_read_at, 'epoch')  
        -- if last_read_at is NULL, count *all* messages
    ) AS unread_count

  FROM public.conversations c

  -- bring in *all* participants so we can JSON-aggregate the other user
  JOIN public.conversation_participants cp ON c.id = cp.conversation_id
  JOIN public.users u                   ON cp.user_id = u.id

  -- only conversations you haven’t soft-deleted
  WHERE c.id IN (
    SELECT cp3.conversation_id
    FROM public.conversation_participants cp3
    WHERE cp3.user_id = pid
      AND cp3.deleted_at IS NULL
  )
  AND cp.user_id != pid   -- exclude yourself from the JSON “participants” list

  -- group by conversation for aggregation
  GROUP BY c.id

  -- show most recently updated (i.e. newest message) at top
  ORDER BY c.updated_at DESC;

END;$$;


ALTER FUNCTION "public"."get_conversations_for_user"("pid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$begin
  insert into public.users (id, email, phone, first_name, last_name, role_id, created_at, updated_at)
  values (
    new.id, 
    new.email, 
    new.phone, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name', 
    (new.raw_user_meta_data ->> 'role_id')::int,  -- Extract role_id from raw_user_meta_data and cast to int
    now(), 
    now()
  );
  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."restore_conversation_visibility"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  update conversation_participants
  set deleted_at = null
  where conversation_id = NEW.conversation_id
    and user_id != NEW.sender_id
    and deleted_at is not null;
  RETURN NEW;
end;
$$;


ALTER FUNCTION "public"."restore_conversation_visibility"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_public_users"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  UPDATE public.users
  SET 
    email = NEW.email, 
    phone = NEW.phone, 
    first_name = NEW.raw_user_meta_data ->> 'first_name', 
    last_name = NEW.raw_user_meta_data ->> 'last_name', 
    role_id = (NEW.raw_user_meta_data ->> 'role_id')::int,  
    updated_at = NOW()  
    WHERE id = NEW.id;
  RETURN NEW;
  
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error or handle it as needed
      RAISE NOTICE 'Error updating public.users: %', SQLERRM;
      RETURN NEW;  -- Continue with the operation
END;$$;


ALTER FUNCTION "public"."sync_public_users"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_column_value"("table_name" "text", "table_column" "text", "increment" numeric, "user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $_$declare 
  dynamic_sql_query text;
begin
  dynamic_sql_query := format(
    'update %I set %I = %I + $1, updated_at = now() where user_id = $2',
    table_name, table_column, table_column
  );
  execute dynamic_sql_query using increment, user_id; 
end;$_$;


ALTER FUNCTION "public"."update_column_value"("table_name" "text", "table_column" "text", "increment" numeric, "user_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "user_id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "settings" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."settings" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_settings"("u_id" "uuid", "new_settings" "jsonb") RETURNS "public"."settings"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  result public.settings;
BEGIN
 SET search_path TO public, extensions;
  INSERT INTO public.settings (user_id, settings, updated_at)
  VALUES (u_id, new_settings, NOW())
  ON CONFLICT (user_id) DO UPDATE
  SET 
    settings = COALESCE(public.settings.settings, '{}'::jsonb) || EXCLUDED.settings,
    updated_at = NOW()
  RETURNING * INTO result;

  RETURN result;
END;$$;


ALTER FUNCTION "public"."update_settings"("u_id" "uuid", "new_settings" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_credits"("p_user_id" "uuid", "p_credit_count" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$begin
  insert into public.credits (user_id, total_credits, updated_at)
  values (p_user_id, p_credit_count, now())
  on conflict (user_id) DO UPDATE
  set total_credits = public.credits.total_credits + excluded.total_credits,
      updated_at = now();
end;$$;


ALTER FUNCTION "public"."upsert_credits"("p_user_id" "uuid", "p_credit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_packages"("p_user_id" "uuid", "p_inquiry_count" integer, "p_package_name" "public"."package_type") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$begin
  insert into public.packages (user_id, total_inquiries, package_name, updated_at)
  values (p_user_id, p_inquiry_count, p_package_name, now())
  on conflict (user_id) do update
  set total_inquiries = public.packages.total_inquiries + excluded.total_inquiries,
      package_name = excluded.package_name,
      updated_at = now();
end;$$;


ALTER FUNCTION "public"."upsert_packages"("p_user_id" "uuid", "p_inquiry_count" integer, "p_package_name" "public"."package_type") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversation_participants" (
    "conversation_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone,
    "last_read_at" timestamp with time zone,
    "message_cutoff_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."conversation_participants" OWNER TO "postgres";


COMMENT ON TABLE "public"."conversation_participants" IS 'a junction table for the profiles and conversations table to keep track of users part of particular conversations.';



COMMENT ON COLUMN "public"."conversation_participants"."message_cutoff_at" IS 'this denotes the point where the user revoked their participation in a conversation (when they deleted the conversation on the frontend).';



CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "last_message_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."conversations" OWNER TO "postgres";


COMMENT ON TABLE "public"."conversations" IS 'a table to manage conversations between two users.';



CREATE TABLE IF NOT EXISTS "public"."credit_transactions" (
    "id" bigint NOT NULL,
    "transaction_uuid" "uuid" DEFAULT "gen_random_uuid"(),
    "user_id" "uuid" NOT NULL,
    "credits_purchased" integer NOT NULL,
    "price_paid" numeric(10,2) NOT NULL,
    "stripe_transaction_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."credit_transactions" OWNER TO "postgres";


ALTER TABLE "public"."credit_transactions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."credit_transactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."credits" (
    "user_id" "uuid" NOT NULL,
    "total_credits" integer DEFAULT 0 NOT NULL,
    "used_credits" integer DEFAULT 0,
    "remaining_credits" integer GENERATED ALWAYS AS (("total_credits" - "used_credits")) STORED,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."credits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" NOT NULL,
    "stripe_customer_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."customers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."listing_images" (
    "id" bigint NOT NULL,
    "listing_uuid" "uuid" NOT NULL,
    "url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "width" integer NOT NULL,
    "height" integer NOT NULL,
    "path" "text" NOT NULL,
    "full_path" "text" NOT NULL
);


ALTER TABLE "public"."listing_images" OWNER TO "postgres";


COMMENT ON TABLE "public"."listing_images" IS 'a separate table for storing images for property listings.';



ALTER TABLE "public"."listing_images" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."listing_images_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."listings" (
    "landlord_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "location" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "id" bigint NOT NULL,
    "payment_frequency" "public"."listing_payment_frequency" DEFAULT 'daily'::"public"."listing_payment_frequency" NOT NULL,
    "no_of_bedrooms" bigint,
    "listing_type" "public"."listing_type" NOT NULL,
    "availability_status" "public"."listing_availability_status" DEFAULT 'available'::"public"."listing_availability_status" NOT NULL,
    "price" integer NOT NULL,
    "publication_status" "public"."listing_publication_status" DEFAULT 'published'::"public"."listing_publication_status" NOT NULL,
    "idempotency_key" "text",
    "no_of_bathrooms" integer DEFAULT 1 NOT NULL,
    "listings_search_vector" "tsvector" GENERATED ALWAYS AS ((("setweight"("to_tsvector"('"english"'::"regconfig", COALESCE("title", ''::"text")), 'A'::"char") || "setweight"("to_tsvector"('"english"'::"regconfig", COALESCE("location", ''::"text")), 'B'::"char")) || "setweight"("to_tsvector"('"english"'::"regconfig", COALESCE("description", ''::"text")), 'C'::"char"))) STORED
);


ALTER TABLE "public"."listings" OWNER TO "postgres";


COMMENT ON TABLE "public"."listings" IS 'a list of properties available.';



COMMENT ON COLUMN "public"."listings"."uuid" IS 'a unique identifier for a listing used in the application layer.';



COMMENT ON COLUMN "public"."listings"."availability_status" IS 'This is to differentiate columns that are available and have been taken.';



ALTER TABLE "public"."listings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."listings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" bigint NOT NULL,
    "message_uuid" "uuid" DEFAULT "gen_random_uuid"(),
    "sender_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "read_at" timestamp with time zone,
    "edited_at" timestamp with time zone,
    "conversation_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE ONLY "public"."messages" REPLICA IDENTITY FULL;


ALTER TABLE "public"."messages" OWNER TO "postgres";


COMMENT ON TABLE "public"."messages" IS 'to keep track of messages between users';



ALTER TABLE "public"."messages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."packages" (
    "user_id" "uuid" NOT NULL,
    "total_inquiries" integer DEFAULT 0 NOT NULL,
    "used_inquiries" integer DEFAULT 0 NOT NULL,
    "remaining_inquiries" integer GENERATED ALWAYS AS (("total_inquiries" - "used_inquiries")) STORED,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "package_name" "public"."package_type" NOT NULL
);


ALTER TABLE "public"."packages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."plans" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price" numeric(10,2) NOT NULL,
    "role_id" integer NOT NULL,
    "stripe_price_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."plans" OWNER TO "postgres";


ALTER TABLE "public"."plans" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."plans_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."rate_limits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text" NOT NULL,
    "endpoint" "public"."rate_limit_endpoint" NOT NULL,
    "attempts" integer DEFAULT 1 NOT NULL,
    "reset_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."rate_limits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."roles" IS 'a list of user roles';



CREATE SEQUENCE IF NOT EXISTS "public"."roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."roles_id_seq" OWNED BY "public"."roles"."id";



CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "public"."subscription_status" DEFAULT 'active'::"public"."subscription_status",
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ended_at" timestamp with time zone,
    "created" timestamp with time zone DEFAULT "now"() NOT NULL,
    "price_id" "text" NOT NULL,
    "current_period_start" timestamp with time zone DEFAULT "now"() NOT NULL,
    "current_period_end" timestamp with time zone NOT NULL,
    "cancel_at_period_end" boolean DEFAULT false NOT NULL,
    "metadata" "jsonb",
    "cancel_at" timestamp with time zone,
    "canceled_at" timestamp with time zone,
    "quantity" integer,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "trial_start" timestamp with time zone,
    "trial_end" timestamp with time zone
);


ALTER TABLE "public"."subscriptions" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."user_conversations" AS
SELECT
    NULL::"uuid" AS "user_id",
    NULL::"uuid" AS "conversation_id",
    NULL::timestamp with time zone AS "created_at",
    NULL::timestamp with time zone AS "updated_at",
    NULL::timestamp with time zone AS "deleted_at",
    NULL::"jsonb" AS "participant",
    NULL::"text" AS "last_message",
    NULL::timestamp with time zone AS "last_message_sent_at",
    NULL::"uuid" AS "last_message_sender_id",
    NULL::bigint AS "unread_count",
    NULL::"tsvector" AS "conversations_search_vector";


ALTER TABLE "public"."user_conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "first_name" "text",
    "last_name" "text",
    "role_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "avatar_url" "text",
    "about" "text",
    "full_name" "text" GENERATED ALWAYS AS (TRIM(BOTH ' '::"text" FROM ((COALESCE("first_name", ''::"text") || ' '::"text") || COALESCE("last_name", ''::"text")))) STORED
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'a table for all registered users.';



COMMENT ON COLUMN "public"."users"."avatar_url" IS 'for storing the user''s profile avatar';



CREATE OR REPLACE VIEW "public"."visible_messages_for_user" WITH ("security_invoker"='on') AS
 SELECT "m"."id",
    "m"."message_uuid",
    "m"."content",
    "m"."conversation_id",
    "m"."created_at",
    "m"."edited_at",
    "m"."read_at",
    "m"."sender_id",
    "cp"."user_id" AS "viewer_id"
   FROM ("public"."messages" "m"
     JOIN "public"."conversation_participants" "cp" ON (("cp"."conversation_id" = "m"."conversation_id")))
  WHERE ("m"."created_at" > COALESCE("cp"."message_cutoff_at", '1970-01-01 00:00:00+00'::timestamp with time zone));


ALTER TABLE "public"."visible_messages_for_user" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."webhook_events" (
    "event_id" "text" NOT NULL,
    "event_type" "public"."webhook_event_type_enum" NOT NULL,
    "request_id" "text" NOT NULL,
    "status" "public"."webhook_event_status" DEFAULT 'pending'::"public"."webhook_event_status" NOT NULL,
    "processed_at" timestamp with time zone DEFAULT "now"(),
    "error" "text"
);


ALTER TABLE "public"."webhook_events" OWNER TO "postgres";


ALTER TABLE ONLY "public"."roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."conversation_participants"
    ADD CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("conversation_id", "user_id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."credit_transactions"
    ADD CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."credit_transactions"
    ADD CONSTRAINT "credit_transactions_stripe_transaction_id_key" UNIQUE ("stripe_transaction_id");



ALTER TABLE ONLY "public"."credits"
    ADD CONSTRAINT "credits_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."credits"
    ADD CONSTRAINT "credits_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_stripe_customer_id_key" UNIQUE ("stripe_customer_id");



ALTER TABLE ONLY "public"."listing_images"
    ADD CONSTRAINT "listing_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_idempotency_key_key" UNIQUE ("idempotency_key");



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_uuid_key" UNIQUE ("uuid");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_message_uuid_key" UNIQUE ("message_uuid");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."packages"
    ADD CONSTRAINT "packages_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."plans"
    ADD CONSTRAINT "plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."plans"
    ADD CONSTRAINT "plans_stripe_price_id_key" UNIQUE ("stripe_price_id");



ALTER TABLE ONLY "public"."rate_limits"
    ADD CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rate_limits"
    ADD CONSTRAINT "rate_limits_user_id_endpoint_key" UNIQUE ("user_id", "endpoint");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversation_participants"
    ADD CONSTRAINT "unique_conversation_user" UNIQUE ("conversation_id", "user_id");



ALTER TABLE ONLY "public"."listing_images"
    ADD CONSTRAINT "unique_listing_image" UNIQUE ("listing_uuid", "url");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."webhook_events"
    ADD CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("event_id");



CREATE INDEX "conversation_participants_profile_id_idx" ON "public"."conversation_participants" USING "btree" ("user_id");



CREATE INDEX "credit_transactions_user_id_idx" ON "public"."credit_transactions" USING "btree" ("user_id");



CREATE INDEX "idx_credit_transactions_stripe_transaction_id" ON "public"."credit_transactions" USING "btree" ("stripe_transaction_id");



CREATE INDEX "idx_credits_user_id" ON "public"."credits" USING "btree" ("user_id");



CREATE INDEX "idx_messages_sender_id" ON "public"."messages" USING "btree" ("sender_id");



CREATE INDEX "idx_packages_user_id" ON "public"."packages" USING "btree" ("user_id");



CREATE INDEX "idx_plans_role_id" ON "public"."plans" USING "btree" ("role_id");



CREATE INDEX "idx_plans_stripe_price_id" ON "public"."plans" USING "btree" ("stripe_price_id");



CREATE INDEX "idx_properties_landlord_id" ON "public"."listings" USING "btree" ("landlord_id");



CREATE INDEX "idx_rate_limits_reset_at" ON "public"."rate_limits" USING "btree" ("reset_at");



CREATE INDEX "idx_rate_limits_user_endpoint" ON "public"."rate_limits" USING "btree" ("user_id", "endpoint");



CREATE INDEX "idx_subscriptions_user_id" ON "public"."subscriptions" USING "btree" ("user_id");



CREATE INDEX "idx_users_role_id" ON "public"."users" USING "btree" ("role_id");



CREATE INDEX "listings_search_vector_idx" ON "public"."listings" USING "gin" ("listings_search_vector");



CREATE INDEX "messages_conversation_id_idx" ON "public"."messages" USING "btree" ("conversation_id");



CREATE UNIQUE INDEX "unique_trialing_or_active_sub_per_user" ON "public"."subscriptions" USING "btree" ("user_id") WHERE ("status" = ANY (ARRAY['active'::"public"."subscription_status", 'trialing'::"public"."subscription_status"]));



CREATE OR REPLACE VIEW "public"."user_conversations" WITH ("security_invoker"='on') AS
 SELECT "cp"."user_id",
    "c"."id" AS "conversation_id",
    "c"."created_at",
    "c"."updated_at",
    "cp"."deleted_at",
    "jsonb_build_object"('id', "u"."id", 'first_name', "u"."first_name", 'last_name', "u"."last_name", 'full_name', "u"."full_name", 'email', "u"."email", 'role_id', "u"."role_id", 'avatar_url', "u"."avatar_url") AS "participant",
    ( SELECT "m"."content"
           FROM "public"."messages" "m"
          WHERE ("m"."conversation_id" = "c"."id")
          ORDER BY "m"."created_at" DESC
         LIMIT 1) AS "last_message",
    ( SELECT "m"."created_at"
           FROM "public"."messages" "m"
          WHERE ("m"."conversation_id" = "c"."id")
          ORDER BY "m"."created_at" DESC
         LIMIT 1) AS "last_message_sent_at",
    ( SELECT
                CASE
                    WHEN ("m"."sender_id" <> "cp"."user_id") THEN "m"."sender_id"
                    ELSE NULL::"uuid"
                END AS "case"
           FROM "public"."messages" "m"
          WHERE ("m"."conversation_id" = "c"."id")
          ORDER BY "m"."created_at" DESC
         LIMIT 1) AS "last_message_sender_id",
    ( SELECT "count"(*) AS "count"
           FROM ("public"."messages" "m2"
             JOIN "public"."conversation_participants" "cp2" ON ((("cp2"."conversation_id" = "m2"."conversation_id") AND ("cp2"."user_id" = "cp"."user_id"))))
          WHERE (("m2"."conversation_id" = "c"."id") AND ("m2"."sender_id" <> "cp"."user_id") AND ("m2"."created_at" > COALESCE("cp2"."last_read_at", '1970-01-01 00:00:00+00'::timestamp with time zone)))) AS "unread_count",
    ((("setweight"("to_tsvector"('"english"'::"regconfig", COALESCE("u"."first_name", ''::"text")), 'A'::"char") || "setweight"("to_tsvector"('"english"'::"regconfig", COALESCE("u"."last_name", ''::"text")), 'A'::"char")) || "setweight"("to_tsvector"('"english"'::"regconfig", COALESCE("u"."full_name", ''::"text")), 'B'::"char")) || "setweight"("to_tsvector"('"english"'::"regconfig", COALESCE(( SELECT "m"."content"
           FROM "public"."messages" "m"
          WHERE ("m"."conversation_id" = "c"."id")
          ORDER BY "m"."created_at" DESC
         LIMIT 1), ''::"text")), 'C'::"char")) AS "conversations_search_vector"
   FROM ((("public"."conversations" "c"
     JOIN "public"."conversation_participants" "cp" ON ((("cp"."conversation_id" = "c"."id") AND ("cp"."deleted_at" IS NULL))))
     JOIN "public"."conversation_participants" "cp_other" ON ((("cp_other"."conversation_id" = "c"."id") AND ("cp_other"."user_id" <> "cp"."user_id"))))
     JOIN "public"."users" "u" ON (("u"."id" = "cp_other"."user_id")))
  GROUP BY "cp"."user_id", "c"."id", "cp"."deleted_at", "u"."id"
  ORDER BY "c"."updated_at" DESC;



CREATE OR REPLACE TRIGGER "trigger_restore_conversation_visibility" AFTER INSERT ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."restore_conversation_visibility"();



ALTER TABLE ONLY "public"."conversation_participants"
    ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_participants"
    ADD CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."credit_transactions"
    ADD CONSTRAINT "credit_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."credits"
    ADD CONSTRAINT "credits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."listing_images"
    ADD CONSTRAINT "fk_listing_uuid" FOREIGN KEY ("listing_uuid") REFERENCES "public"."listings"("uuid") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."packages"
    ADD CONSTRAINT "packages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."plans"
    ADD CONSTRAINT "plans_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "  Users can update their own settings" ON "public"."settings" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."subscriptions" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Landlords and tenants can view listing images" ON "public"."listing_images" FOR SELECT TO "authenticated" USING ((( SELECT ("auth"."uid"() = ( SELECT "listings"."landlord_id"
           FROM "public"."listings"
          WHERE ("listings"."uuid" = "listing_images"."listing_uuid")))) OR (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role_id" = ( SELECT "roles"."id"
           FROM "public"."roles"
          WHERE ("roles"."name" = 'tenant'::"text"))))))));



CREATE POLICY "Landlords can create their own properties" ON "public"."listings" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "landlord_id"));



CREATE POLICY "Landlords can delete their own listing images" ON "public"."listing_images" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "listings"."landlord_id"
   FROM "public"."listings"
  WHERE ("listings"."uuid" = "listing_images"."listing_uuid"))));



CREATE POLICY "Landlords can delete their own properties" ON "public"."listings" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "landlord_id"));



CREATE POLICY "Landlords can edit their own properties" ON "public"."listings" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "landlord_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "landlord_id"));



CREATE POLICY "Landlords can update their own listing images" ON "public"."listing_images" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "listings"."landlord_id"
   FROM "public"."listings"
  WHERE ("listings"."uuid" = "listing_images"."listing_uuid")))) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "listings"."landlord_id"
   FROM "public"."listings"
  WHERE ("listings"."uuid" = "listing_images"."listing_uuid"))));



CREATE POLICY "Landlords can upload their own listing images" ON "public"."listing_images" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "listings"."landlord_id"
   FROM "public"."listings"
  WHERE ("listings"."uuid" = "listing_images"."listing_uuid"))));



CREATE POLICY "Landlords can view their own listings" ON "public"."listings" FOR SELECT TO "authenticated" USING (( SELECT ("auth"."uid"() = "listings"."landlord_id")));



CREATE POLICY "Tenants can view published listings" ON "public"."listings" FOR SELECT TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role_id" = ( SELECT "roles"."id"
           FROM "public"."roles"
          WHERE ("roles"."name" = 'tenant'::"text")))))) AND ("publication_status" = 'published'::"public"."listing_publication_status")));



CREATE POLICY "User  (tenants & landlords) can only view their own profiles" ON "public"."users" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "User can only update their own messages" ON "public"."messages" FOR UPDATE TO "authenticated" USING (( SELECT (( SELECT "auth"."uid"() AS "uid") = "messages"."sender_id"))) WITH CHECK (( SELECT (( SELECT "auth"."uid"() AS "uid") = "messages"."sender_id")));



CREATE POLICY "Users can add conversation participants" ON "public"."conversation_participants" FOR INSERT TO "authenticated" WITH CHECK ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."conversation_participants" "conversation_participants_1"
  WHERE (("conversation_participants_1"."conversation_id" = "conversation_participants_1"."conversation_id") AND ("conversation_participants_1"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "Users can create conversations" ON "public"."conversations" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Users can create their own package record" ON "public"."packages" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can insert messages in their conversations" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK ((("sender_id" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM "public"."conversation_participants"
  WHERE (("conversation_participants"."conversation_id" = "messages"."conversation_id") AND ("conversation_participants"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "Users can insert their own credits record" ON "public"."credits" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can insert their own settings" ON "public"."settings" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can only delete their own messages" ON "public"."messages" FOR DELETE TO "authenticated" USING (( SELECT (( SELECT "auth"."uid"() AS "uid") = "messages"."sender_id")));



CREATE POLICY "Users can only update their own messages" ON "public"."conversation_participants" FOR UPDATE TO "authenticated" USING ("public"."check_participant_access"("conversation_id", "user_id"));



CREATE POLICY "Users can update their conversations" ON "public"."conversations" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."conversation_participants"
  WHERE (("conversation_participants"."conversation_id" = "conversations"."id") AND ("conversation_participants"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."conversation_participants"
  WHERE (("conversation_participants"."conversation_id" = "conversations"."id") AND ("conversation_participants"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can update their own credits record" ON "public"."credits" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can update their own package record" ON "public"."packages" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can update their own profiles" ON "public"."users" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can view messages in their conversations" ON "public"."messages" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."conversation_participants"
  WHERE (("conversation_participants"."conversation_id" = "messages"."conversation_id") AND ("conversation_participants"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("conversation_participants"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view their conversation participants" ON "public"."conversation_participants" FOR SELECT TO "authenticated" USING ("public"."check_participant_access"("conversation_id", "user_id"));



CREATE POLICY "Users can view their conversations" ON "public"."conversations" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."conversation_participants" "cp"
  WHERE (("cp"."conversation_id" = "conversations"."id") AND ("cp"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can view their own credits" ON "public"."credits" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can view their own package record" ON "public"."packages" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can view their own settings" ON "public"."settings" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can view their roles" ON "public"."roles" FOR SELECT TO "authenticated" USING (("id" = ( SELECT "users"."role_id"
   FROM "public"."users"
  WHERE ("users"."id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."conversation_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."credit_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."credits" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."listing_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."listings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."packages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rate_limits" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."webhook_events" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."conversation_participants";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."conversations";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
























































































































































































































GRANT ALL ON FUNCTION "public"."attempt_insert_webhook_event"("p_event_id" "text", "p_event_type" "public"."webhook_event_type_enum", "p_request_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."attempt_insert_webhook_event"("p_event_id" "text", "p_event_type" "public"."webhook_event_type_enum", "p_request_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."attempt_insert_webhook_event"("p_event_id" "text", "p_event_type" "public"."webhook_event_type_enum", "p_request_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."broadcast_table_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."broadcast_table_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."broadcast_table_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_participant_access"("convo_id" "uuid", "pid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_participant_access"("convo_id" "uuid", "pid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_participant_access"("convo_id" "uuid", "pid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_password_match"("user_id" "uuid", "new_password" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_password_match"("user_id" "uuid", "new_password" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_password_match"("user_id" "uuid", "new_password" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_user_existence"("user_email_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_user_existence"("user_email_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_user_existence"("user_email_address" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_conversation"("initiator_id" "uuid", "recipient_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_conversation"("initiator_id" "uuid", "recipient_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_conversation"("initiator_id" "uuid", "recipient_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."evaluate_rate_limit"("p_user_id" "text", "p_endpoint" "public"."rate_limit_endpoint", "p_max_attempts" integer, "p_window_hours" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."evaluate_rate_limit"("p_user_id" "text", "p_endpoint" "public"."rate_limit_endpoint", "p_max_attempts" integer, "p_window_hours" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."evaluate_rate_limit"("p_user_id" "text", "p_endpoint" "public"."rate_limit_endpoint", "p_max_attempts" integer, "p_window_hours" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_conversations_for_user"("pid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_conversations_for_user"("pid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_conversations_for_user"("pid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."restore_conversation_visibility"() TO "anon";
GRANT ALL ON FUNCTION "public"."restore_conversation_visibility"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."restore_conversation_visibility"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_public_users"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_public_users"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_public_users"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_column_value"("table_name" "text", "table_column" "text", "increment" numeric, "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_column_value"("table_name" "text", "table_column" "text", "increment" numeric, "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_column_value"("table_name" "text", "table_column" "text", "increment" numeric, "user_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";



GRANT ALL ON FUNCTION "public"."update_settings"("u_id" "uuid", "new_settings" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."update_settings"("u_id" "uuid", "new_settings" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_settings"("u_id" "uuid", "new_settings" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."upsert_credits"("p_user_id" "uuid", "p_credit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_credits"("p_user_id" "uuid", "p_credit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_credits"("p_user_id" "uuid", "p_credit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."upsert_packages"("p_user_id" "uuid", "p_inquiry_count" integer, "p_package_name" "public"."package_type") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_packages"("p_user_id" "uuid", "p_inquiry_count" integer, "p_package_name" "public"."package_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_packages"("p_user_id" "uuid", "p_inquiry_count" integer, "p_package_name" "public"."package_type") TO "service_role";
























GRANT ALL ON TABLE "public"."conversation_participants" TO "anon";
GRANT ALL ON TABLE "public"."conversation_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."conversation_participants" TO "service_role";



GRANT ALL ON TABLE "public"."conversations" TO "anon";
GRANT ALL ON TABLE "public"."conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."conversations" TO "service_role";



GRANT ALL ON TABLE "public"."credit_transactions" TO "anon";
GRANT ALL ON TABLE "public"."credit_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."credit_transactions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."credit_transactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."credit_transactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."credit_transactions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."credits" TO "anon";
GRANT ALL ON TABLE "public"."credits" TO "authenticated";
GRANT ALL ON TABLE "public"."credits" TO "service_role";



GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";



GRANT ALL ON TABLE "public"."listing_images" TO "anon";
GRANT ALL ON TABLE "public"."listing_images" TO "authenticated";
GRANT ALL ON TABLE "public"."listing_images" TO "service_role";



GRANT ALL ON SEQUENCE "public"."listing_images_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."listing_images_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."listing_images_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."listings" TO "anon";
GRANT ALL ON TABLE "public"."listings" TO "authenticated";
GRANT ALL ON TABLE "public"."listings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."listings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."listings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."listings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."packages" TO "anon";
GRANT ALL ON TABLE "public"."packages" TO "authenticated";
GRANT ALL ON TABLE "public"."packages" TO "service_role";



GRANT ALL ON TABLE "public"."plans" TO "anon";
GRANT ALL ON TABLE "public"."plans" TO "authenticated";
GRANT ALL ON TABLE "public"."plans" TO "service_role";



GRANT ALL ON SEQUENCE "public"."plans_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."plans_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."plans_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rate_limits" TO "anon";
GRANT ALL ON TABLE "public"."rate_limits" TO "authenticated";
GRANT ALL ON TABLE "public"."rate_limits" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."user_conversations" TO "anon";
GRANT ALL ON TABLE "public"."user_conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."user_conversations" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."visible_messages_for_user" TO "anon";
GRANT ALL ON TABLE "public"."visible_messages_for_user" TO "authenticated";
GRANT ALL ON TABLE "public"."visible_messages_for_user" TO "service_role";



GRANT ALL ON TABLE "public"."webhook_events" TO "anon";
GRANT ALL ON TABLE "public"."webhook_events" TO "authenticated";
GRANT ALL ON TABLE "public"."webhook_events" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
