USE empDb;

TRUNCATE TABLE department;

INSERT department (`name`) VALUES ('Finance');
INSERT department (`name`) VALUES ('Clinical Operations');
INSERT department (`name`) VALUES ('Bioinformatics');

SELECT * FROM department;

TRUNCATE TABLE `role`;

INSERT `role` (title, salary, department_id) VALUES ('Manager',100000.00,1);
INSERT `role` (title, salary, department_id) VALUES ('Analyst','75000.00',1);
INSERT `role` (title, salary, department_id) VALUES ('Clinical Operations Manager','80000.00',2);
INSERT `role` (title, salary, department_id) VALUES ('Clinical Operations Assistant','60000.00',2);
INSERT `role` (title, salary, department_id) VALUES ('Principal Biostatistician','95000.00',3);
INSERT `role` (title, salary, department_id) VALUES ('Biostatistician','95000.00',3);

select * from `role`;

TRUNCATE TABLE employee;

INSERT employee (first_name, last_name, role_id, manager_id) VALUES ('Ello','Asty',1,NULL);
INSERT employee (first_name, last_name, role_id, manager_id) VALUES ('Slowen','Lo',2,1);
INSERT employee (first_name, last_name, role_id, manager_id) VALUES ('Wedge','Antilles',3,NULL);
INSERT employee (first_name, last_name, role_id, manager_id) VALUES ('Jek','Porkins',4,3);
INSERT employee (first_name, last_name, role_id, manager_id) VALUES ('Bib','Fortuna',5,NULL);
-- INSERT employee (first_name, last_name, role_id, manager_id) VALUES ('Salacious','Crumb',6,5);

select * from employee;
