-- These polices are to be placed in the Auth Policies Section in the Database.
--
--
-- ROLES TABLE (CHECKED)
-----------------------------------------------------
CREATE POLICY "Admins can view all roles" ON public.roles FOR
SELECT
    TO authenticated USING (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    );

CREATE POLICY "Admins can insert roles" ON public.roles FOR
INSERT
    TO authenticated WITH CHECK (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    );

CREATE POLICY "Admins can update any role" ON public.roles FOR
UPDATE
    TO authenticated USING (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    ) WITH CHECK (true);

CREATE POLICY "Admins can delete any role" ON public.roles FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT
            1
        FROM
            public.profiles
        WHERE
            profiles.id = auth.uid()
            AND profiles.role_id = (
                SELECT
                    roles.id
                FROM
                    public.roles
                WHERE
                    roles.name = 'admin'
            )
    )
);

-------------------------------------------------------
--
--
--
-- PROFILES TABLE
--
--
--- FOR ALL USERS
-------------------------------------------
CREATE POLICY "Users can view their own data" ON public.profiles FOR
SELECT
    TO authenticated USING (id = auth.uid());

CREATE POLICY "Users can insert their own data" ON public.profiles FOR
INSERT
    TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON public.profiles FOR
UPDATE
    TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Users can delete their own data" ON public.profiles FOR DELETE TO authenticated USING (id = auth.uid());

-------------------------------------------
--
--
--- FOR ADMINS
-----------------------------------------------
CREATE POLICY "Admins can view all user data" ON public.profiles FOR
SELECT
    TO authenticated USING (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    );

CREATE POLICY "Admins can insert user data" ON public.profiles FOR
INSERT
    TO authenticated WITH CHECK (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    );

CREATE POLICY "Admins can update any user data" ON public.profiles FOR
UPDATE
    TO authenticated USING (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    ) WITH CHECK (true);

CREATE POLICY "Admins can delete any user data" ON public.profiles FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT
            1
        FROM
            public.profiles
        WHERE
            profiles.id = auth.uid()
            AND profiles.role_id = (
                SELECT
                    roles.id
                FROM
                    public.roles
                WHERE
                    roles.name = 'admin'
            )
    )
);

-----------------------------------------------
--
--
--
-- PROPERTIES TABLE
--
--
-- FOR LANDLORDS
CREATE POLICY "Landlords can view their own properties" ON public.properties FOR
SELECT
    TO authenticated USING (landlord_id = auth.uid());

CREATE POLICY "Landlords can insert their own properties" ON public.properties FOR
INSERT
    TO authenticated WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Landlords can update their own properties" ON public.properties FOR
UPDATE
    TO authenticated USING (landlord_id = auth.uid()) WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Landlords can delete their own properties" ON public.properties FOR DELETE TO authenticated USING (landlord_id = auth.uid());

--
--
--- FOR ADMINS 
--------------------------------------------
CREATE POLICY "Admins can view all properties" ON public.properties FOR
SELECT
    TO authenticated USING (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    );

CREATE POLICY "Admins can insert properties" ON public.properties FOR
INSERT
    TO authenticated WITH CHECK (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    );

CREATE POLICY "Admins can update any properties" ON public.properties FOR
UPDATE
    TO authenticated USING (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    ) WITH CHECK (true);

CREATE POLICY "Admins can delete any properties" ON public.properties FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT
            1
        FROM
            public.profiles
        WHERE
            profiles.id = auth.uid()
            AND profiles.role_id = (
                SELECT
                    roles.id
                FROM
                    public.roles
                WHERE
                    roles.name = 'admin'
            )
    )
);

--------------------------------------------
--
--
--
-- PROPERTY TENANTS TABLE
--
--
-- FOR LANDLORDS
CREATE POLICY "Landlords can view their own property_tenants" ON public.property_tenants FOR
SELECT
    TO authenticated USING (
        property_id IN (
            SELECT
                id
            FROM
                public.properties
            WHERE
                landlord_id = auth.uid()
        )
    );

CREATE POLICY "Landlords can insert their own property_tenants" ON public.property_tenants FOR
INSERT
    TO authenticated WITH CHECK (
        property_id IN (
            SELECT
                id
            FROM
                public.properties
            WHERE
                landlord_id = auth.uid()
        )
    );

CREATE POLICY "Landlords can update their own property_tenants" ON public.property_tenants FOR
UPDATE
    TO authenticated USING (
        property_id IN (
            SELECT
                id
            FROM
                public.properties
            WHERE
                landlord_id = auth.uid()
        )
    ) WITH CHECK (
        property_id IN (
            SELECT
                id
            FROM
                public.properties
            WHERE
                landlord_id = auth.uid()
        )
    );

CREATE POLICY "Landlords can delete their own property_tenants" ON public.property_tenants FOR DELETE TO authenticated USING (
    property_id IN (
        SELECT
            id
        FROM
            public.properties
        WHERE
            landlord_id = auth.uid()
    )
);

--
--
--- FOR ADMINS
CREATE POLICY "Admins can view all property_tenants" ON public.property_tenants FOR
SELECT
    TO authenticated USING (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    );

CREATE POLICY "Admins can insert property_tenants" ON public.property_tenants FOR
INSERT
    TO authenticated WITH CHECK (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    );

CREATE POLICY "Admins can update any property_tenants" ON public.property_tenants FOR
UPDATE
    TO authenticated USING (
        EXISTS (
            SELECT
                1
            FROM
                public.profiles
            WHERE
                profiles.id = auth.uid()
                AND profiles.role_id = (
                    SELECT
                        roles.id
                    FROM
                        public.roles
                    WHERE
                        roles.name = 'admin'
                )
        )
    ) WITH CHECK (true);

CREATE POLICY "Admins can delete any property_tenants" ON public.property_tenants FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT
            1
        FROM
            public.profiles
        WHERE
            profiles.id = auth.uid()
            AND profiles.role_id = (
                SELECT
                    roles.id
                FROM
                    public.roles
                WHERE
                    roles.name = 'admin'
            )
    )
);

--
--
--
-- MESSAGES TABLE
CREATE POLICY "Users can view their own messages" ON public.messages FOR
SELECT
    TO authenticated USING (
        sender_id = auth.uid()
        OR receiver_id = auth.uid()
    );

CREATE POLICY "Users can insert their own messages" ON public.messages FOR
INSERT
    TO authenticated WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their own messages" ON public.messages FOR
UPDATE
    TO authenticated USING (sender_id = auth.uid()) WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages" ON public.messages FOR DELETE TO authenticated USING (sender_id = auth.uid());

--
--
--
-- MEDIA TABLE
CREATE POLICY "Users can view their own media" ON public.media FOR
SELECT
    TO authenticated USING (
        model_id IN (
            SELECT
                id
            FROM
                public.properties
            WHERE
                landlord_id = auth.uid()
        )
        OR model_id IN (
            SELECT
                id
            FROM
                public.messages
            WHERE
                sender_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own media" ON public.media FOR
INSERT
    TO authenticated WITH CHECK (
        model_id IN (
            SELECT
                id
            FROM
                public.properties
            WHERE
                landlord_id = auth.uid()
        )
        OR model_id IN (
            SELECT
                id
            FROM
                public.messages
            WHERE
                sender_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own media" ON public.media FOR
UPDATE
    TO authenticated USING (
        model_id IN (
            SELECT
                id
            FROM
                public.properties
            WHERE
                landlord_id = auth.uid()
        )
        OR model_id IN (
            SELECT
                id
            FROM
                public.messages
            WHERE
                sender_id = auth.uid()
        )
    ) WITH CHECK (
        model_id IN (
            SELECT
                id
            FROM
                public.properties
            WHERE
                landlord_id = auth.uid()
        )
        OR model_id IN (
            SELECT
                id
            FROM
                public.messages
            WHERE
                sender_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own media" ON public.media FOR DELETE TO authenticated USING (
    model_id IN (
        SELECT
            id
        FROM
            public.properties
        WHERE
            landlord_id = auth.uid()
    )
    OR model_id IN (
        SELECT
            id
        FROM
            public.messages
        WHERE
            sender_id = auth.uid()
    )
);

----rls for profiles table
----(( SELECT auth.uid() AS uid) = id)
---- rls for roles table
-- messages rls in regards to users viewing messages in their conversations
(
    (
        (
            SELECT
                auth.uid() AS uid
        ) = sender_id
    )
    OR (
        conversation_id IN (
            SELECT
                conversations.id
            FROM
                conversations
            WHERE
                (
                    (
                        conversations.user1_id = (
                            SELECT
                                auth.uid() AS uid
                        )
                    )
                    OR (
                        conversations.user2_id = (
                            SELECT
                                auth.uid() AS uid
                        )
                    )
                )
        )
    )
)