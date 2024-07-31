do $$
begin
    if not exists (
select
	1
from
	pg_namespace
where
	nspname = 'fast_food') then
        create schema fast_food;
end if;
end
$$;

create table if not exists fast_food.customer (
    id uuid,
    name varchar(255) not null,
    document varchar(11) not null unique,
    email varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint pk_customer primary key (id)
);

create type fast_food.payment_type_enum as enum (
  'DINHEIRO',
  'CARTAO_CREDITO',
  'CARTAO_DEBITO',
  'PIX',
  'VALE_REFEICAO'
);

create type fast_food.payment_status_enum as enum (
  'PENDENTE',
  'AUTORIZADO',
  'REJEITADO',
  'REEMBOLSADO'
);

create table if not exists fast_food.payment(
    id uuid,
    effective_date timestamp default current_timestamp,
    type fast_food.payment_type_enum not null,
    status fast_food.payment_status_enum not null default 'PENDENTE',
    updated_at timestamp default current_timestamp,
    external_id varchar,
    constraint pk_payment primary key (id)
);

create type fast_food.order_status_enum as enum (
  'RECEBIDO',
  'EM_PREPARO',
  'PRONTO',
  'FINALIZADO',
  'CANCELADO'
);

create table if not exists fast_food.order (
    id bigserial,
    customer_id uuid,
    total_amount numeric(10, 2) not null,
    status fast_food.order_status_enum not null default 'RECEBIDO',
    payment_id uuid not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint pk_order primary key (id),
    constraint fk_order_customer foreign key (customer_id) references fast_food.customer(id),
    constraint fk_order_payment foreign key (payment_id) references fast_food.payment(id)
);

create type fast_food.category_enum as enum (
  'LANCHE',
  'ACOMPANHAMENTO',
  'BEBIDA',
  'SOBREMESA'
);

create table if not exists fast_food.product (
    id bigserial,
    name varchar(255) not null,
    description text not null,
    price decimal(10, 2) not null,
    image_links text[],
    category fast_food.category_enum not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint pk_product primary key (id)
);

create table if not exists fast_food.product_order (
    id bigserial,
    order_id integer not null,
    product_id integer not null,
    quantity integer not null,
    unit_price decimal(10, 2) not null,
    observation text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint pk_product_order primary key (id),
    constraint fk_product_order_product foreign key (product_id) references fast_food.product(id),
    constraint fk_product_order_order foreign key (order_id) references fast_food.order(id)
);
