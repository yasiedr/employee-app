const inquirer = require("inquirer");

const db = require("../db/connection");

const get = async (id) => {
  const connection = await db;
  const query = `SELECT * FROM departments WHERE id=?`;
  const values = [id];
  const [rows] = await connection.execute(query, values);

  return rows.length != 0 ? rows[0] : null;
};

const getAll = async () => {
  const connection = await db;
  const query = `SELECT * FROM departments`;
  const [rows] = await connection.execute(query);

  return rows.length != 0 ? rows : null;
};

const getAllDepartmentNames = async () => {
  const connection = await db;
  const query = `SELECT name FROM departments`;
  const [rows] = await connection.execute(query);

  return rows.length != 0 ? rows.map((elem) => elem.name) : null;
};

const getByName = async (name) => {
  const connection = await db;
  const query = `SELECT * FROM departments WHERE name=?`;
  const values = [name];

  const [rows] = await connection.execute(query, values);

  return rows.length != 0 ? rows[0] : null;
};

const add = async (department) => {
  const connection = await db;
  const query = `INSERT INTO departments (name) VALUES (?)`;
  const values = [department.name];

  const [{ insertId }] = await connection.execute(query, values);
  return insertId;
};

const showAddMenu = async () => {
  const inputs = await inquirer.prompt([
    {
      type: "input",
      name: "departmentName",
      message: "What is the name of the new department?",
    },
  ]);

  return inputs;
};

const showSelectDepartmentMenu = async () => {
  const titles = await getAllDepartmentNames();
  if (titles) {
    const { departmentTitle } = await inquirer.prompt([
      {
        type: "list",
        name: "departmentTitle",
        message: "select a department?",
        choices: titles,
      },
    ]);
    return departmentTitle;
  }

  return null;
};

const remove = async (id) => {
  const connection = await db;
  const query = `DELETE FROM departments WHERE id = ?`;
  const values = [id];

  const [{ affectedRows }] = await connection.execute(query, values);
  return affectedRows > 0;
};

module.exports = {
  get,
  getAll,
  getByName,
  getAllDepartmentNames,
  add,
  remove,
  showAddMenu,
  showSelectDepartmentMenu,
};
