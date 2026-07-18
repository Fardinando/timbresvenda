create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  nome text not null,
  password_hash text not null,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text unique not null,
  descricao text,
  instrucoes text,
  ml_item_id text,
  github_release_tag text,
  chunks jsonb default '[]'::jsonb,
  arquivo_nome text,
  arquivo_tamanho text,
  ativo boolean default true,
  created_at timestamptz default now()
);

create table if not exists codigos (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  produto_id uuid references produtos(id) on delete cascade,
  usado boolean default false,
  usado_em timestamptz,
  usuario_id uuid references usuarios(id),
  ml_order_id text,
  created_at timestamptz default now()
);

create table if not exists usuario_produtos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id) on delete cascade,
  produto_id uuid references produtos(id) on delete cascade,
  activated_at timestamptz default now(),
  unique(usuario_id, produto_id)
);

create table if not exists pedidos_ml (
  id uuid primary key default gen_random_uuid(),
  ml_order_id text unique not null,
  ml_buyer_id text,
  ml_buyer_nickname text,
  ml_buyer_email text,
  produto_id uuid references produtos(id),
  codigo_id uuid references codigos(id),
  status text default 'pendente',
  error_message text,
  created_at timestamptz default now()
);

create index if not exists idx_codigos_codigo on codigos(codigo);
create index if not exists idx_codigos_produto on codigos(produto_id);
create index if not exists idx_usuario_produtos_usuario on usuario_produtos(usuario_id);
create index if not exists idx_usuario_produtos_produto on usuario_produtos(produto_id);
create index if not exists idx_pedidos_ml_order on pedidos_ml(ml_order_id);
create index if not exists idx_produtos_slug on produtos(slug);
