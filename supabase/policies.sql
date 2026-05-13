-- Admin UID placeholder; replace with real admin UID in production
-- This file defines RLS policies to constrain access to the pickups table.

-- Function to identify admin user by UID (replace placeholder)
CREATE OR REPLACE FUNCTION is_admin_uid() RETURNS BOOLEAN AS $$
  SELECT auth.uid() = 'INSERT_YOUR_ADMIN_UID_HERE';
$$ LANGUAGE SQL STABLE;

-- Enable RLS should be applied on the table creation; policies depend on it.
-- Policies are defined in migrations file for clarity.
