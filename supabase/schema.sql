create table if not exists employees (
  id bigserial primary key,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists loans (
  id bigserial primary key,
  employee_id bigint not null references employees(id) on delete cascade,
  amount numeric not null,
  date date not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists payments (
  id bigserial primary key,
  employee_id bigint not null references employees(id) on delete cascade,
  amount numeric not null,
  date date not null,
  created_at timestamptz default now()
);

create index if not exists idx_loans_employee on loans(employee_id);
create index if not exists idx_payments_employee on payments(employee_id);
