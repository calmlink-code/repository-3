-- ローカル版で保持している休会・復会情報をSupabaseでも欠落させないための列。
-- Supabase Dashboard の SQL Editor で一度だけ実行してください。
alter table public.students
  add column if not exists pause_month text,
  add column if not exists resume_month text,
  add column if not exists attendance_days integer not null default 0;
