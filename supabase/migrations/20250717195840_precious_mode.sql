/*
  # Initial Schema for Failed Startup Postmortem Platform

  1. New Tables
    - `teardowns` - Main failure stories/teardowns
    - `story_submissions` - User submitted failure stories
    - `newsletter_subscribers` - Newsletter subscription data
    - `teardown_images` - Images associated with teardowns
    - `submission_images` - Images associated with submissions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admins
    - Public read access for published teardowns
    - Admin-only access for submissions management

  3. Features
    - Full-text search on teardowns
    - Image storage support
    - Audit trails with timestamps
    - Status tracking for submissions
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create teardowns table
CREATE TABLE IF NOT EXISTS teardowns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  market text NOT NULL,
  revenue text NOT NULL,
  duration text NOT NULL,
  failure_reasons text[] NOT NULL DEFAULT '{}',
  lessons_learned text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  current_venture_name text DEFAULT '',
  current_venture_url text DEFAULT '',
  source_url text DEFAULT '',
  short_description text NOT NULL,
  detailed_summary text NOT NULL,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Create story_submissions table
CREATE TABLE IF NOT EXISTS story_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_name text NOT NULL,
  founder_name text NOT NULL,
  email text NOT NULL,
  market text NOT NULL,
  duration text NOT NULL,
  revenue text DEFAULT '',
  failure_reasons text[] NOT NULL DEFAULT '{}',
  lessons_learned text[] NOT NULL DEFAULT '{}',
  detailed_story text NOT NULL,
  source_links text DEFAULT '',
  current_venture text DEFAULT '',
  current_venture_url text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  user_id uuid REFERENCES auth.users(id),
  notes text DEFAULT ''
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  name text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  user_id uuid REFERENCES auth.users(id),
  source text DEFAULT 'website'
);

-- Create teardown_images table
CREATE TABLE IF NOT EXISTS teardown_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  teardown_id uuid REFERENCES teardowns(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create submission_images table
CREATE TABLE IF NOT EXISTS submission_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id uuid REFERENCES story_submissions(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teardowns_status ON teardowns(status);
CREATE INDEX IF NOT EXISTS idx_teardowns_created_at ON teardowns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_teardowns_market ON teardowns(market);
CREATE INDEX IF NOT EXISTS idx_teardowns_tags ON teardowns USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_story_submissions_status ON story_submissions(status);
CREATE INDEX IF NOT EXISTS idx_story_submissions_submitted_at ON story_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- Enable full-text search
CREATE INDEX IF NOT EXISTS idx_teardowns_search ON teardowns USING GIN(
  to_tsvector('english', name || ' ' || short_description || ' ' || detailed_summary)
);

-- Enable Row Level Security
ALTER TABLE teardowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teardown_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_images ENABLE ROW LEVEL SECURITY;

-- Policies for teardowns (public read, admin write)
CREATE POLICY "Anyone can read published teardowns"
  ON teardowns
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all teardowns"
  ON teardowns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage teardowns"
  ON teardowns
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'isaacbawan@gmail.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policies for story submissions
CREATE POLICY "Users can read own submissions"
  ON story_submissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create submissions"
  ON story_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all submissions"
  ON story_submissions
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'isaacbawan@gmail.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policies for newsletter subscribers
CREATE POLICY "Users can manage own subscription"
  ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR email = auth.jwt() ->> 'email');

CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can read all subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'isaacbawan@gmail.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policies for images
CREATE POLICY "Anyone can read teardown images"
  ON teardown_images
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage teardown images"
  ON teardown_images
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'isaacbawan@gmail.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Users can read own submission images"
  ON submission_images
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM story_submissions 
      WHERE id = submission_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own submission images"
  ON submission_images
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM story_submissions 
      WHERE id = submission_id AND user_id = auth.uid()
    ) OR
    auth.jwt() ->> 'email' = 'isaacbawan@gmail.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_teardowns_updated_at
  BEFORE UPDATE ON teardowns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();