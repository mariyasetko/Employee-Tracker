DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

USE employees;

drop table if exists departments;
drop table if exists roles;
drop table if exists employees;

create table departments (
    departmentId int auto_increment primary key,
    departmentName varchar(30),
    departmentManager varchar(30)
);

create table roles (
    roleId int auto_increment primary key,
    title varchar(45),
    salary decimal,
    departmentId int,
    constraint fk_departments foreign key (departmentId) references departments(departmentId) on delete cascade
);

create table employees(
    id int not null auto_increment primary key,
    firstName varchar(30) not null,
    lastName varchar(30) not null,
    roleId int,
    managerId int null,
    constraint fk_role foreign key (roleId) references roles(roleId) on delete cascade
);