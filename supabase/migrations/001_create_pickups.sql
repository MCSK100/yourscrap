-- Create pickups table
CREATE TABLE IF NOT EXISTS pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  estimated_weight NUMERIC,
  pickup_date DATE,
  status TEXT DEFAULT 'pending' NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;

-- Function to identify admin user by UID (replace the placeholder with actual admin UID)
CREATE OR REPLACE FUNCTION is_admin_uid() RETURNS BOOLEAN AS $$
  SELECT auth.uid() = 'INSERT_YOUR_ADMIN_UID_HERE';
$$ LANGUAGE SQL STABLE;

-- Policies: owners can view/modify their own data; admin can view all
CREATE POLICY "pickup_select_owner_or_admin" ON pickups
  FOR SELECT USING (auth.uid() = (user_id::text) OR is_admin_uid());
CREATE POLICY "pickup_insert_own_or_admin" ON pickups
  FOR INSERT WITH CHECK (auth.uid() = (new.user_id::text) OR is_admin_uid());
CREATE POLICY "pickup_update_own_or_admin" ON pickups
  FOR UPDATE USING (auth.uid() = (user_id::text) OR is_admin_uid())
  WITH CHECK (auth.uid() = (new.user_id::text) OR is_admin_uid());
CREATE POLICY "pickup_delete_own_or_admin" ON pickups
  FOR DELETE USING (auth.uid() = (user_id::text) OR is_admin_uid());
