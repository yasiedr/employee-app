const inquirer = require("inquirer");

const db = require("../db/connection");
const department = require("./dpt");

const get = async (id) => {
  const connection = await db;
  const query = `SELECT * FROM roles WHERE id=?`;
  const values = [id]
  const [rows] = await connection.execute(query, values);

  return rows.length != 0 ? rows[0] : null;
};

const getAll = async () => {
  const connection = await db;
  const query = `SELECT * FROM roles`;
  const [rows] = await connection.execute(query);

  return rows.length != 0 ? rows : null;
};

const getByTitle = async (title) => {
  const connection = await db;
  const query = `SELECT * FROM roles WHERE title=?`;
  const values = [title];

  const [rows] = await connection.execute(query, values);

  return rows.length != 0 ? rows[0] : null;
};

const getAllRoleTitles = async () => {
  const connection = await db;
  const query = `SELECT title FROM roles`;
  const [rows] = await connection.execute(query);

  return rows.length != 0 ? rows.map((elem) => elem.title) : null;
};

const add = async (role) => {
  const connection = await db;
  const query = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
  const values = [role.title, role.salary, role.department_id];

  const [{ insertId }] = await connection.execute(query, values);
  return insertId;
};

const remove = async (id) => {
  const connection = await db;
  const query = `DELETE FROM roles WHERE id = ?`;
  const values = [id];

  const [{ affectedRows }] = await connection.execute(query, values);
  return affectedRows > 0;
}

const showAddMenu = async () => {
  const inputs = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of the new role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the new role?",
    },
  ]);

  inputs["departmentName"] = await department.showSelectDepartmentMenu();

  return inputs;
};

const showSelectroleMenu = async (defaultItem) => {
  const titles = await getAllRoleTitles();
  if (titles) {
    const { roleTitle } = await inquirer.prompt([
      {
        type: "list",
        name: "roleTitle",
        message: "what is the employee's role?",
        choices: titles,
        default: defaultItem
      },
    ]);
    return roleTitle;
  }

  return null;
};

module.exports = {
  get,
  getAll,
  getByTitle,
  add,
  remove,
  showSelectroleMenu,
  showAddMenu,
};
