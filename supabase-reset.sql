-- ================================================================
-- ShopNow — RESET & RIKRIJO politikat (ekzekuto këtë nëse ke gabim "policy already exists")
-- Supabase → SQL Editor → New query → Run
-- ================================================================

-- ── FSHI POLITIKAT E VJETRA ──────────────────────────────────────

-- profiles
drop policy if exists "Profiles: user sheh veten" on public.profiles;
drop policy if exists "Profiles: user update veten" on public.profiles;
drop policy if exists "Profiles: admin sheh te gjitha" on public.profiles;
drop policy if exists "Profiles: superadmin update te gjitha" on public.profiles;

-- products
drop policy if exists "Products: public lexon aktive" on public.products;
drop policy if exists "Products: admin sheh te gjitha" on public.products;
drop policy if exists "Products: admin shton" on public.products;
drop policy if exists "Products: admin modifikon" on public.products;
drop policy if exists "Products: admin fshin" on public.products;

-- orders
drop policy if exists "Orders: user sheh te vetat" on public.orders;
drop policy if exists "Orders: user krijon" on public.orders;
drop policy if exists "Orders: admin sheh te gjitha" on public.orders;
drop policy if exists "Orders: admin update status" on public.orders;

-- wishlist
drop policy if exists "Wishlist: user menaxhon veten" on public.wishlist;

-- product_views
drop policy if exists "Views: public lexon" on public.product_views;
drop policy if exists "Views: public shton" on public.product_views;

-- storage
drop policy if exists "Storage: public lexon" on storage.objects;
drop policy if exists "Storage: admin ngarkon" on storage.objects;
drop policy if exists "Storage: admin fshin" on storage.objects;

-- ── TABELA (nëse nuk ekzistojnë) ─────────────────────────────────

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  name         text not null,
  role         text not null default 'user' check (role in ('user','admin','superadmin')),
  created_at   timestamptz default now()
);
alter table public.profiles enable row level security;

create table if not exists public.products (
  id          bigserial primary key,
  name        text not null,
  brand       text not null,
  category    text not null default 'clothing',
  gender      text,
  price       numeric(10,2) not null,
  old_price   numeric(10,2),
  description text,
  sizes       text[] default '{"S","M","L","XL"}',
  photo_url   text,
  is_sale     boolean default false,
  is_active   boolean default true,
  stars       numeric(2,1) default 5.0,
  reviews     int default 0,
  views       int default 0,
  created_by  uuid references auth.users(id),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.products enable row level security;

create table if not exists public.orders (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  items       jsonb not null,
  total       numeric(10,2) not null,
  status      text default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  created_at  timestamptz default now()
);
alter table public.orders enable row level security;

create table if not exists public.wishlist (
  id         bigserial primary key,
  user_id    uuid references auth.users(id) on delete cascade,
  product_id bigint references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
alter table public.wishlist enable row level security;

create table if not exists public.product_views (
  product_id  bigint references public.products(id) on delete cascade,
  viewed_at   timestamptz default now(),
  session_id  text
);
alter table public.product_views enable row level security;

-- ── POLITIKAT E REJA ──────────────────────────────────────────────

-- profiles
create policy "Profiles: user sheh veten" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles: user update veten" on public.profiles
  for update using (auth.uid() = id);

create policy "Profiles: admin sheh te gjitha" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin'))
  );

create policy "Profiles: superadmin update te gjitha" on public.profiles
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'superadmin')
  );

-- products
create policy "Products: public lexon aktive" on public.products
  for select using (is_active = true);

create policy "Products: admin sheh te gjitha" on public.products
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin'))
  );

create policy "Products: admin shton" on public.products
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin'))
  );

create policy "Products: admin modifikon" on public.products
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin'))
  );

create policy "Products: admin fshin" on public.products
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin'))
  );

-- orders
create policy "Orders: user sheh te vetat" on public.orders
  for select using (auth.uid() = user_id);

create policy "Orders: user krijon" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Orders: admin sheh te gjitha" on public.orders
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin'))
  );

create policy "Orders: admin update status" on public.orders
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin'))
  );

-- wishlist
create policy "Wishlist: user menaxhon veten" on public.wishlist
  for all using (auth.uid() = user_id);

-- product_views
create policy "Views: public lexon" on public.product_views for select using (true);
create policy "Views: public shton" on public.product_views for insert with check (true);

-- storage
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Storage: public lexon" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Storage: admin ngarkon" on storage.objects
  for insert with check (
    bucket_id = 'product-images' and
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin'))
  );

create policy "Storage: admin fshin" on storage.objects
  for delete using (
    bucket_id = 'product-images' and
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin'))
  );

-- ── TRIGGER ───────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- ── SEED DATA (vetëm nëse tabela është bosh) ─────────────────────
insert into public.products (name, brand, category, price, old_price, description, sizes, is_sale, stars, reviews, views)
select * from (values
  ('Zip-Up Hoodie', 'CAMP DAVID', 'clothing', 145.90, 179.90, 'Hoodie premium me zinxhir të plotë, material i butë dhe i ngrohtë.', '{"S","M","L","XL","XXL"}'::text[], true, 4.5, 128, 342),
  ('Regular fit Button Up Shirt', 'ONLY & SONS', 'clothing', 54.90, null::numeric, 'Këmishë elegante me prerje normale. Ideale për çdo rast.', '{"XS","S","M","L","XL"}'::text[], false, 4.2, 86, 156),
  ('Comfort fit Plaid Shirt', 'SELECTED', 'clothing', 99.90, null::numeric, 'Këmishë me model karoqe klasik. Stil timeless.', '{"S","M","L","XL"}'::text[], false, 4.7, 204, 289),
  ('Running Sneakers Pro', 'ADIDAS', 'shoes', 89.90, 119.90, 'Këpucë atletike me sole EVA për amortizim maksimal.', '{"40","41","42","43","44","45"}'::text[], true, 4.8, 512, 891),
  ('Classic Leather Loafers', 'BOSS', 'shoes', 189.00, null::numeric, 'Mokasina lëkure autentike, elegancë supreme.', '{"40","41","42","43","44"}'::text[], false, 4.6, 93, 178),
  ('Sport Backpack 30L', 'THE NORTH FACE', 'accessories', 79.90, null::numeric, 'Çantë shpine ujërezistues, kapacitet 30L.', '{"ONE SIZE"}'::text[], false, 4.4, 167, 234)
) as v(name, brand, category, price, old_price, description, sizes, is_sale, stars, reviews, views)
where not exists (select 1 from public.products limit 1);
