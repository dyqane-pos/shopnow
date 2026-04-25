-- ================================================================
-- Migration: shto kolonën tags te tabela products
-- Ekzekuto këtë në: Supabase → SQL Editor → New query → Run
-- ================================================================

alter table public.products
  add column if not exists tags text[] default '{}';
