-- Run this in Supabase → SQL Editor → New query → Run
-- Adds the categories table used for dynamic navbar/sidebar filtering

create table if not exists public.categories (
  id          text primary key,
  label       text not null,
  type        text not null check (type in ('product', 'gender', 'sidebar')),
  sort_order  int default 0,
  is_active   boolean default true
);

alter table public.categories enable row level security;

create policy "Categories: public lexon" on public.categories
  for select using (is_active = true);

create policy "Categories: admin menaxhon" on public.categories
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin'))
  );

-- Seed: gender categories
insert into public.categories (id, label, type, sort_order, is_active) values
  ('men',   'Men',   'gender',  0, true),
  ('women', 'Women', 'gender',  1, true)
on conflict (id) do nothing;

-- Seed: product categories (shown in navbar row 2)
insert into public.categories (id, label, type, sort_order, is_active) values
  ('all',         'Të gjitha',   'product', 0, true),
  ('clothing',    'Veshje',      'product', 1, true),
  ('shoes',       'Këpucë',      'product', 2, true),
  ('accessories', 'Aksesore',    'product', 3, true),
  ('sports',      'Sport',       'product', 4, true),
  ('electronics', 'Elektronikë', 'product', 5, true)
on conflict (id) do nothing;

-- Seed: sidebar links
insert into public.categories (id, label, type, sort_order, is_active) values
  ('new',         'New',                 'sidebar',  0, true),
  ('trending',    'Trending',            'sidebar',  1, true),
  ('t-shirts',    'T-shirts',            'sidebar',  2, true),
  ('jeans',       'Jeans',               'sidebar',  3, true),
  ('jackets',     'Jackets',             'sidebar',  4, true),
  ('pants',       'Pants',               'sidebar',  5, true),
  ('sweaters',    'Sweaters & hoodies',  'sidebar',  6, true),
  ('underwear',   'Underwear',           'sidebar',  7, true),
  ('shirts',      'Button-up shirts',    'sidebar',  8, true),
  ('suits',       'Suits & jackets',     'sidebar',  9, true),
  ('swimwear',    'Swimwear',            'sidebar', 10, true),
  ('coats',       'Coats',               'sidebar', 11, true),
  ('plus-sizes',  'Plus sizes',          'sidebar', 12, true),
  ('occasions',   'Occasions',           'sidebar', 13, true),
  ('exclusive',   'Exclusive',           'sidebar', 14, true)
on conflict (id) do nothing;
