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
