INSERT INTO departments (name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal'),
('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES
('Salesperson', 80000, 1),
('Sales Lead', 100000, 1),
('Engineer', 120000, 2),
('Lead Engineer', 150000, 2),
('Accountant', 125000, 3),
('Chief Financial Officer', 300000, 3),
('Lawyer', 190000, 4),
('Legal Team Lead', 250000, 4),
('Human Resources Employee', 80000, 5),
('Human Resources Director', 100000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Jon', 'Donkowski', 1, null),
('Mike', 'Chan', 2, null),
('Ashley', 'Rodriguez', 3, null),
('Kevin', 'Tupik', 4, null),
('Malia', 'Brown', 5, null),
('Sarah', 'Lourd', 6, null),
('Tom', 'Allen', 7, null),
('Jackie', 'Meyer', 8, null),
('Tyson', 'Mack', 9, null),
('Rebecca', 'Flounder', 10, null);