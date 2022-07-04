DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

USE employees;

DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;

CREATE TABLE departments (
    departmentId INT auto_increment PRIMARY KEY,
    departmentName VARCHAR(30),
    departmentManager VARCHAR(30)
);

CREATE TABLE roles (
    roleId INT auto_increment PRIMARY KEY,
    title VARCHAR(45),
    salary DECIMAL,
    departmentId INT,
    CONSTRAINT fk_departments FOREIGN KEY (departmentId) REFERENCES departments(departmentId) on delete cascade
);

CREATE TABLE employees(
    id INT NOT NULL auto_increment PRIMARY KEY,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    roleId INT,
    managerId INT NULL,
    CONSTRAINT fk_roles FOREIGN KEY (roleId) REFERENCES roles(roleId) ON DELETE CASCADE
);