-- Create the roles table 
CREATE TABLE roles (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    role_name TEXT UNIQUE NOT NULL
);

-- Create the users table 
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    role_id BIGINT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uuid UUID DEFAULT gen_random_uuid(),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create the properties table 
CREATE TABLE properties (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    landlord_id BIGINT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    number_of_tenants INTEGER DEFAULT 0,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    uuid UUID DEFAULT gen_random_uuid(),
    FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the property_tenants table 
CREATE TABLE property_tenants (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    property_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    uuid UUID DEFAULT gen_random_uuid(),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the messages table 
CREATE TABLE messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE,
    property_id BIGINT NOT NULL,
    uuid UUID DEFAULT gen_random_uuid(),
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create the media table with polymorphic association 
CREATE TABLE media (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    model_id BIGINT NOT NULL,
    model_type TEXT CHECK (model_type IN ('property', 'message')) NOT NULL,
    media_type TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uuid UUID DEFAULT gen_random_uuid()
);