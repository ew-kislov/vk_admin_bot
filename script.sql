-- Create all needed tables

create table conversation (
    id int(10) not null auto_increment,
    peer_id varchar(20) not null,
    name varchar(50) not null,
    init_time datetime not null,
    primary key(id)
) DEFAULT CHARSET cp1251;

create table user_role (
    id int(2) not null auto_increment,
    name varchar(50) not null,
    primary key (id)
) DEFAULT CHARSET cp1251;

create table action_type (
    id int(3) not null auto_increment,
    name varchar(50) not null,
    primary key (id)
) DEFAULT CHARSET cp1251;

create table action (
    id int(10) not null auto_increment,
    type_id int(3) not null,
    creation_date datetime not null,
    vk_user_id varchar(20) not null,
    details text,
    primary key (id),
    foreign key (type_id) references action_type (id)
) DEFAULT CHARSET cp1251;

create table user_role_conversation_join (
    vk_user_id varchar(20) not null,
    user_role_id int(2) not null,
    conversation_id int(10),
    foreign key (user_role_id) references user_role (id),
    foreign key (conversation_id) references conversation (id)
) DEFAULT CHARSET cp1251;

-- Define user roles

insert into user_role(name) values
    ('administrator'),
    ('moderator');

-- Define administrator

insert into user_role_conversation_join(vk_user_id, user_role_id) values('137733276', 1);

-- Define action types

insert into action_type(name) values
    ('Conversation initialized'),
    ('Conversation initialization denied'),
    ('Message sent'),
    ('Message seding denied'),
    ('Broadcast message sent'),
    ('Broadcast message sending denied'),
    ('User kicked'),
    ('User kick denied'),
    ('User granted'),
    ('User grant denied');
