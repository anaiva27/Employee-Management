DROP DATABASE IF EXISTS employees;

CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) UNIQUE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `title` VARCHAR(30) NOT NULL,
    `salary` DECIMAL NOT NULL,
    `department_id` INT NOT NULL,
    PRIMARY KEY (id),
    -- INDEX dep_ind (department_id),
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
     `id` INT NOT NULL AUTO_INCREMENT ,
     `first_name` VARCHAR(30) NOT NULL,
     `last_name` VARCHAR(30) NOT NULL,
     `role_id` INT NOT NULL,
     
    --  INDEX role_ind (role_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
     `manager_id` INT,
    PRIMARY KEY (id),
    --  INDEX manager_ind (manager_id),
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL

);

USE employees;

INSERT INTO department
(name)
VALUES ('Sales'), 
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles
(title, salary, department_id)
VALUES ('Sales manager', 10000, 1),
('Accountant', 30000, 3),
('Project_manager', 20000, 2),
('Paralegal', 40000, 4),
('Back-end_developer', 20000, 2),
('Front-end_developer', 20000, 2),
('Financial_analyst', 30000, 3);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES ('Anastasia', 'Warren', 2, 1),
('Jennifer', 'Morales', 1, NULL),
('Jordan', 'Rosso', 4, 2),
('Chris', 'Nolan', 3, NULL),
('Alexader', 'Crow', 4, 4),
('Santa', 'Clauses', 2, 1),
('Britney', 'Green', 5, 4),
('Ryan', 'Simp', 1, NULL),
('Jeff', 'McDonald', 4, 8),
('Brain', 'Kurts', 5, 4),
('John', 'Bawer', 6, 4),
('Daniel', 'Orzo', 7, 8);