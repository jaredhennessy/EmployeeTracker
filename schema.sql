DROP DATABASE IF EXISTS empDb;

CREATE DATABASE empDb;

USE empDb;

DROP TABLE IF EXISTS department;

CREATE TABLE department
(
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(30),
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS role;

CREATE TABLE role
(
	id int NOT NULL AUTO_INCREMENT,
	title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS employee;

CREATE TABLE employee
(
	id int NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(30),
	last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
	PRIMARY KEY (id)
);
