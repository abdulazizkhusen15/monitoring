-- Project Monitoring System Schema (Multi-User)

-- 1. Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  status boolean default true,
  created_at timestamptz default now(),
  unique(user_id, name)
);

create index if not exists idx_projects_user on projects(user_id);
create index if not exists idx_projects_name on projects(name);

-- 2. Project Items (Catalog)
create table if not exists project_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  item_code text not null,
  unit text not null,
  is_completed boolean default false,
  created_at timestamptz default now(),
  unique(project_id, name)
);

create index if not exists idx_project_items_user on project_items(user_id);
create index if not exists idx_project_items_project on project_items(project_id);
create index if not exists idx_project_items_code on project_items(item_code);

-- 3. Inventory Transactions
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'transaction_type') then
    create type transaction_type as enum ('IN', 'OUT', 'USAGE');
  end if;
end $$;

create table if not exists inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  project_id uuid references projects(id) on delete cascade,
  item_id uuid references project_items(id) on delete cascade,
  type transaction_type not null,
  quantity decimal not null,
  date date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_inventory_transactions_user on inventory_transactions(user_id);
create index if not exists idx_inventory_transactions_item on inventory_transactions(item_id);

-- 4. Enable RLS (Row Level Security)
alter table projects enable row level security;
alter table project_items enable row level security;
alter table inventory_transactions enable row level security;

-- 5. RLS Policies

-- Projects: Users can only interact with their own projects
drop policy if exists "Users can perform all actions on their own projects" on projects;
create policy "Users can perform all actions on their own projects"
on projects for all
using (auth.uid() = user_id);

-- Project Items: Users can only interact with their own items
drop policy if exists "Users can perform all actions on their own items" on project_items;
create policy "Users can perform all actions on their own items"
on project_items for all
using (auth.uid() = user_id);

-- Transactions: Users can only interact with their own transactions
drop policy if exists "Users can perform all actions on their own transactions" on inventory_transactions;
create policy "Users can perform all actions on their own transactions"
on inventory_transactions for all
using (auth.uid() = user_id);
