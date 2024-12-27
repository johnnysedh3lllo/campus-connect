--
--
-- ROLES
CREATE INDEX idx_roles_name ON roles(role_name);

--
--
-- USERS
CREATE INDEX idx_profiles_email ON profiles(email);

CREATE INDEX idx_profiles_phone ON profiles(phone);

CREATE INDEX idx_profiles_role_id ON profiles(role_id);

--
--
-- PROPERTIES
CREATE INDEX idx_properties_landlord_id ON properties(landlord_id);

CREATE INDEX idx_properties_uuid ON properties(uuid);

--
--
-- PROPERTY TENANTS
CREATE INDEX idx_property_tenants_property_id ON property_tenants(property_id);

CREATE INDEX idx_property_tenants_tenant_id ON property_tenants(tenant_id);

--
--
-- MESSAGES
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);

CREATE INDEX idx_messages_property_id ON messages(property_id);

--
--
-- MEDIA
CREATE INDEX idx_media_model_id ON media(model_id);

CREATE INDEX idx_media_model_type ON media(model_type);