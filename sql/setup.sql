-- ============================================================
-- First Academy Foundation — Admin Portal database setup
-- Paste this whole file into: Supabase Dashboard > SQL Editor > New Query > Run
-- ============================================================

-- 1. Table that stores every news post
create table if not exists news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  event_date date,
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Turn on Row Level Security (RLS) — required before any policy works
alter table news_posts enable row level security;

-- 3. The public website may only ever READ posts marked "published"
create policy "Public can read published posts"
on news_posts for select
to anon
using (is_published = true);

-- 4. A logged-in admin can read every post, including unpublished drafts
create policy "Admin can read all posts"
on news_posts for select 
to authenticated
using (true);

-- 5. Only a logged-in admin can create, edit, or delete posts
create policy "Admin can insert posts"
on news_posts for insert
to authenticated
with check (true);

create policy "Admin can update posts"
on news_posts for update
to authenticated
using (true)
with check (true);

create policy "Admin can delete posts"
on news_posts for delete
to authenticated
using (true);
