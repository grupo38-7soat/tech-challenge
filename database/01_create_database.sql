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

create table if not exists fast_food.order (
    id bigserial,
    customer_id uuid,
    order_date timestamp default current_timestamp,
    amount numeric(10, 2) not null,
    status varchar(255) not null default 'Pedido Recebido',
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint pk_order primary key (id),
    constraint fk_order_customer foreign key (customer_id) references fast_food.customer(id)
);

create table if not exists fast_food.product (
    id bigserial,
    name varchar(255) not null,
    description text,
    category varchar(255) not null,
    price decimal(10, 2) not null,
    link_photo text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint pk_product primary key (id)
);

create table if not exists fast_food.product_order (
    id bigserial,
    order_id integer,
    product_id integer,
    quantity integer not null,
    unit_price decimal(10, 2) not null,
    observation text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint pk_product_order primary key (id),
    constraint fk_product_order_product foreign key (product_id) references fast_food.product(id),
    constraint fk_product_order_order foreign key (order_id) references fast_food.order(id)
);

create table if not exists fast_food.payment_type(
    id serial,
    name varchar(255),
    constraint pk_payment_type primary key (id)
);

create table if not exists fast_food.payment_status (
    id serial,
    name varchar(100),
    constraint pk_payment_status primary key (id)
);

create table if not exists fast_food.payment(
    id serial,
    payment_date timestamp default current_timestamp,
    order_id integer,
    payment_type_id integer,
    status_payment_id integer,
    constraint pk_payment primary key (id),
    constraint fk_payment_order foreign key (order_id) references fast_food.order(id),
    constraint fk_payment_payment_type foreign key (payment_type_id) references fast_food.payment_type(id),
    constraint fk_payment_payment_status foreign key (status_payment_id) references fast_food.payment_status(id)
);
