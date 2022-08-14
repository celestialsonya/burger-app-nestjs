CREATE TABLE "users"(
    "id" serial primary key,
    "username" varchar(255) not null,
    "phone_number" varchar(255) not null,
    "role" varchar(255) not null
);

CREATE TABLE "product"(
    "id" serial primary key,
    "name" varchar(255) not null,
    "description" varchar(255) not null,
    "price" integer not null,
    "category" varchar(255) not null
);

CREATE TABLE "orders"(
    "order_id" serial primary key,
    "user_id" integer not null,
    "cart" varchar[] not null,
    "username" varchar(255) not null,
    "phone_number" varchar(255) not null,
    "amount" integer not null,
    "delivery" boolean not null,
    "delivery_details" json,
    "status" varchar(255) not null,
    "data" varchar(255) not null,
    CONSTRAINT user_id_fk
        foreign key (user_id)
        references users(id)
        on delete cascade
);