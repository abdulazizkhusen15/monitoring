-- ... existing tables ...
create table if not exists employees (
  id bigserial primary key,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists admins (
  id bigserial primary key,
  username text not null unique,
  password text not null,
  created_at timestamptz default now()
);

-- Insert default admin account (username: admin, password: admin)
insert into admins (username, password) 
values ('admin', 'admin') 
on conflict (username) do nothing;

create index if not exists idx_admins_username on admins(username);

-- New Tables for Project Management
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  status boolean default true,
  created_at timestamptz default now()
);

create index if not exists idx_projects_name on projects(name);

create table if not exists project_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  quantity text not null,
  is_completed boolean default false,
  created_at timestamptz default now(),
  unique(project_id, name)
);

create index if not exists idx_project_items_project_id on project_items(project_id);
