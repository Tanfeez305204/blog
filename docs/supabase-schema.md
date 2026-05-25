# Qalam Blog Studio Supabase Schema

Run this SQL in the Supabase SQL editor. The app uses `SUPABASE_SERVICE_ROLE_KEY` only in server routes and server components.

```sql
create extension if not exists pgcrypto;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  emoji text default '✦',
  description text default '',
  post_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text default '',
  excerpt varchar(160) default '',
  featured_image_url text default '',
  featured_image_public_id text default '',
  category_id uuid references public.categories(id) on delete set null,
  tags text[] not null default '{}',
  author text not null default 'Qalam Editorial',
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  scheduled_at timestamptz,
  seo_meta_title text default '',
  seo_meta_description varchar(160) default '',
  seo_og_image text default '',
  seo_focus_keyword text default '',
  views integer not null default 0,
  read_time integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now(),
  is_active boolean not null default true
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blogs(id) on delete cascade,
  name text not null,
  message text not null,
  is_approved boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password text not null,
  name text not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blogs_status_idx on public.blogs(status);
create index blogs_slug_idx on public.blogs(slug);
create index blogs_category_id_idx on public.blogs(category_id);
create index blogs_created_at_idx on public.blogs(created_at desc);
create index blogs_tags_idx on public.blogs using gin(tags);
create index comments_blog_id_idx on public.comments(blog_id);
create index users_email_idx on public.users(email);
create index users_role_idx on public.users(role);
```

## Updated At Triggers

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger blogs_set_updated_at
before update on public.blogs
for each row execute function public.set_updated_at();

create trigger comments_set_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();
```

## Optional Starter Categories

```sql
## Starter Users

```sql
insert into public.users (email, password, name, role) values
  ('ta2nfeez@gmail.com', 'Tanfeez@901', 'Admin User', 'admin'),
  ('user@example.com', 'User@123', 'Main User', 'user');
```

## Optional Starter Categories

```sql
insert into public.categories (name, slug, emoji, description) values
  ('Technology', 'technology', '🚀', 'Tools, AI, software, and digital trends.'),
  ('Business', 'business', '💼', 'Freelancing, startups, and practical growth.'),
  ('Dev', 'dev', '✍️', 'Developer guides and engineering notes.'),
  ('Lifestyle', 'lifestyle', '🌿', 'Daily routines, productivity, and life design.'),
  ('Health', 'health', '🩺', 'Healthy habits and wellbeing.');
```

## Row Level Security

The app uses the service-role key on the server, so RLS can stay enabled and locked down. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code.

```sql
alter table public.categories enable row level security;
alter table public.blogs enable row level security;
alter table public.subscribers enable row level security;
alter table public.comments enable row level security;
```

## Required Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@qalam.local
ADMIN_PASSWORD=admin12345
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
