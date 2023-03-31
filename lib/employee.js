const inquirer = require("inquirer");

const db = require("../db/connection");
const role = require("./role");

const get = async (id) => {
  const connection = await db;
  const query = `SELECT * FROM employees WHERE id=?`;
  const values = [id];
  const [rows] = await connection.execute(query, values);

  return rows.length != 0 ? rows[0] : null;
};

const getAll = async () => {
  const connection = await db;
  const query = `SELECT * FROM employees`;
  const [rows] = await connection.execute(query);

  return rows.length != 0 ? rows : null;
};

const getByName = async (firstName, lastName) => {
  const connection = await db;
  const query = `SELECT * FROM employees WHERE first_name=? AND last_name=?`;
  const values = [firstName, lastName];

  const [rows] = await connection.execute(query, values);

  return rows.length != 0 ? rows[0] : null;
};

const getAllEmployeesNames = async () => {
  const connection = await db;
  const query = `SELECT CONCAT_WS(' ',first_name, last_name) AS full_name FROM employees`;
  const [rows] = await connection.execute(query);

  return rows.length != 0 ? rows.map((elem) => elem.full_name) : null;
};

const add = async (employee) => {
  const connection = await db;
  const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  const values = [
    employee.first_name,
    employee.last_name,
    employee.role_id,
    employee.manager_id,
  ];

  const [{ insertId }] = await connection.execute(query, values);
  return insertId;
};

const update = async (employee) => {
  const connection = await db;
  const query = `UPDATE employees SET first_name = ?,last_name = ?,role_id = ?,manager_id = ? WHERE id = ?`;
  const values = [
    employee.first_name,
    employee.last_name,
    employee.role_id,
    employee.manager_id,
    employee.id,
  ];

  const [{ changedRows }] = await connection.execute(query, values);
  return changedRows > 0 ? true : false;
};

const remove = async (id) => {
  const connection = await db;
  const query = `DELETE FROM employees WHERE id = ?`;
  const values = [id];

  const [{ affectedRows }] = await connection.execute(query, values);
  return affectedRows > 0;
};

const showSelectEmployeeMenu = async (message, defaultItem) => {
  const employeesName = await getAllEmployeesNames();
  if (employeesName) {
    const { employee } = await inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message,
        choices: employeesName,
        default: defaultItem,
      },
    ]);
    return employee;
  }

  return null;
};

const showAddMenu = async () => {
  const inputs = await inquirer.prompt([
    {
      type: "input",
      name: "first",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last",
      message: "What is the employee's last name?",
    },
    {
      type: "confirm",
      name: "confirmManager",
      message: "Does this employee have a manager?",
      default: true,
    },
  ]);

  if (inputs.confirmManager) {
    inputs["manager"] = await showSelectEmployeeMenu(
      "Who is the employee's manager?"
    );
  }

  inputs["roleTitle"] = await role.showSelectroleMenu();

  return inputs;
};

const showUpdateMenu = async () => {
  const selectedEmployeeName = await showSelectEmployeeMenu(
    "Select an employee..."
  );

  const [firstName, lastName] = selectedEmployeeName.split(" ");
  const { id, first_name, last_name, role_id, manager_id } = await getByName(
    firstName,
    lastName
  );

  const employeeRole = await role.get(role_id);
  let roleTitle = null;
  if (employeeRole) {
    roleTitle = employeeRole.title;
  }

  let managerName = null;
  if (manager_id) {
    const manager = await get(manager_id);
    managerName = manager.first_name + " " + manager.last_name;
  }

  const updatedEmployeeFields = await inquirer.prompt([
    {
      type: "input",
      name: "first",
      message: "first name:",
      default: first_name,
    },
    {
      type: "input",
      name: "last",
      message: "last name:",
      default: last_name,
    },
  ]);

  updatedEmployeeFields["manager"] = await showSelectEmployeeMenu(
    "Select an manager:",
    managerName
  );
  updatedEmployeeFields["roleTitle"] = await role.showSelectroleMenu(roleTitle);
  updatedEmployeeFields["id"] = id;
  return updatedEmployeeFields;
};

module.exports = {
  get,
  getAll,
  getAllEmployeesNames,
  getByName,
  add,
  update,
  remove,
  showAddMenu,
  showUpdateMenu,
  showSelectEmployeeMenu,
};
