-- ================================================================
-- Migration: shto kolonën photos[] te tabela products
-- Ekzekuto këtë në: Supabase → SQL Editor → New query → Run
-- ================================================================

alter table public.products
  add column if not exists photos text[] default '{}';

-- Migro photo_url ekzistuese te kolona photos (vetëm ku photos është bosh)
update public.products
  set photos = array[photo_url]
  where photo_url is not null
    and photo_url <> ''
    and (photos is null or array_length(photos, 1) is null);
