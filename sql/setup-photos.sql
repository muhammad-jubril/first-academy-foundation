-- ============================================================
-- First Academy Foundation — Gallery & Section Photos upgrade
-- Paste this whole file into: Supabase Dashboard > SQL Editor > New Query > Run
-- (Run this AFTER sql/setup.sql — this adds two new tables,
-- it does not touch the existing news_posts table at all.)
-- ============================================================

-- ============================================================
-- 1. GALLERY PHOTOS
-- ============================================================

create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table gallery_photos enable row level security;

create policy "Public can read published gallery photos"
on gallery_photos for select
to anon
using (is_published = true);

create policy "Admin can read all gallery photos"
on gallery_photos for select
to authenticated
using (true);

create policy "Admin can insert gallery photos"
on gallery_photos for insert
to authenticated
with check (true);

create policy "Admin can update gallery photos"
on gallery_photos for update
to authenticated
using (true)
with check (true);

create policy "Admin can delete gallery photos"
on gallery_photos for delete
to authenticated
using (true);

-- Seed with the photos already live on the site today, so nothing
-- visually changes until the admin edits something. Safe to run
-- more than once — it skips seeding if rows already exist.
insert into gallery_photos (image_url, caption, display_order)
select * from (values
  ('images/graduation.jpg', 'Graduation Ceremony', 1),
  ('images/teachers-day.jpg', 'Teachers'' Day Celebration', 2),
  ('images/parents.jpg', 'Our Parents', 3),
  ('images/proprietress.jpg', 'Our Leadership', 4),
  ('https://images.unsplash.com/photo-1632932693914-89b90ae3d16d?auto=format&fit=crop&w=900&q=80', 'Nursery Learning', 5),
  ('https://images.unsplash.com/photo-1521493959102-bdd6677fdd81?auto=format&fit=crop&w=900&q=80', 'Primary Classroom', 6)
) as seed(image_url, caption, display_order)
where not exists (select 1 from gallery_photos);


-- ============================================================
-- 2. SECTION PHOTOS (Nursery / Primary / Secondary cover photos)
-- Always exactly 3 rows — admin replaces the photo, never adds/removes a row.
-- ============================================================

create table if not exists section_photos (
  section_key text primary key check (section_key in ('nursery', 'primary', 'secondary')),
  image_url text not null,
  updated_at timestamptz not null default now()
);

alter table section_photos enable row level security;

create policy "Public can read section photos"
on section_photos for select
to anon
using (true);

create policy "Admin can read section photos"
on section_photos for select
to authenticated
using (true);

create policy "Admin can update section photos"
on section_photos for update
to authenticated
using (true)
with check (true);

-- Seed the 3 fixed rows with the photos already live on the site today.
insert into section_photos (section_key, image_url) values
  ('nursery', 'https://images.unsplash.com/photo-1632932693914-89b90ae3d16d?auto=format&fit=crop&w=900&q=80'),
  ('primary', 'https://images.unsplash.com/photo-1521493959102-bdd6677fdd81?auto=format&fit=crop&w=900&q=80'),
  ('secondary', 'https://images.unsplash.com/photo-1548102249-acdce64fffbd?auto=format&fit=crop&w=900&q=80')
on conflict (section_key) do nothing;
