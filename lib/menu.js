const inquirer = require("inquirer");

const department = require("./dpt");
const role = require("./role");
const employee = require("./employee");

const showMainMenu = async () => {
  const { menu } = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      pageSize: 20,
      choices: [
        new inquirer.Separator("-----VIEW-----"),
        "View all departments",
        "View all roles",
        "View all employees",
        new inquirer.Separator("-----ADD-----"),
        "Add a department",
        "Add a role",
        "Add an employee",
        new inquirer.Separator("-----UPDATE-----"),
        "Update an employee",
        new inquirer.Separator("-----REMOVE-----"),
        "Remove a department",
        "Remove a role",
        "Remove an employee",
        new inquirer.Separator("----------------"),
        "Exit",
      ],
    },
  ]);

  let inputs;
  let managerId;
  let roleId;
  let result;
  let firstName;
  let lastName;
  let selectedEmployee;
  let selectedRole;
  let selectedDepartment;

  switch (menu) {
    case "View all departments":
      const departments = await department.getAllDepartmentNames();
      if (departments) console.table(departments);
      else console.log("There isn't any department");
      break;

    case "View all roles":
      const selectedRoleTitle = await role.showSelectroleMenu();

      if (!selectedRoleTitle) {
        console.log("There isn't any role.");
        break;
      }

      selectedRole = await role.getByTitle(selectedRoleTitle);
      const roleDepartment = await department.get(selectedRole.department_id);

      let departmentName = null;
      if (roleDepartment) {
        departmentName = roleDepartment.name;
      }

      console.table({
        title: selectedRole.title,
        salary: selectedRole.salary,
        department: departmentName,
      });
      break;

    case "View all employees":
      const employeeName = await employee.showSelectEmployeeMenu(
        "Select an employee to view its informations."
      );

      if (!employeeName) {
        console.log("There isn't any employee");
        break;
      }

      [firstName, lastName] = employeeName.split(" ");
      selectedEmployee = await employee.getByName(firstName, lastName);
      const manager = await employee.get(selectedEmployee.manager_id);
      let managerName = null;
      if (manager) {
        managerName = manager.first_name + " " + manager.last_name;
      }

      const employeeRole = await role.get(selectedEmployee.role_id);
      let employeeRoleTitle = null;
      if (employeeRole) {
        employeeRoleTitle = employeeRole.title;
      }
      console.table({
        "first name": selectedEmployee.first_name,
        "last name": selectedEmployee.last_name,
        manager: managerName,
        role: employeeRoleTitle,
      });
      break;

    case "Add a department":
      inputs = await department.showAddMenu();
      const newDepartment = {
        name: inputs["departmentName"],
      };

      const newdepartmentId = await department.add(newDepartment);
      console.log(`Department with id=${newdepartmentId} inserted`);
      break;

    case "Add a role":
      inputs = await role.showAddMenu();

      selectedDepartment = await department.getByName(inputs["departmentName"]);
      let departmentId = null;
      if (selectedDepartment) departmentId = selectedDepartment.id;

      const newRole = {
        title: inputs["title"],
        salary: inputs["salary"],
        department_id: departmentId,
      };

      const newRoleId = await role.add(newRole);
      console.log(`Role with id=${newRoleId} inserted`);
      break;

    case "Add an employee":
      inputs = await employee.showAddMenu();

      managerId = null;
      if (inputs["manager"]) {
        const managerName = inputs["manager"].split(" ");
        managerId = (await employee.getByName(managerName[0], managerName[1]))
          .id;
      }

      selectedRole = await role.getByTitle(inputs["roleTitle"]);
      roleId = null;
      if (selectedRole) {
        roleId = selectedRole.id;
      }

      const newEmployee = {};
      newEmployee["first_name"] = inputs["first"];
      newEmployee["last_name"] = inputs["last"];
      newEmployee["role_id"] = roleId;
      newEmployee["manager_id"] = managerId;

      const newEmployeeId = await employee.add(newEmployee);
      console.log(`Employee with id=${newEmployeeId} inserted`);
      break;

    case "Update an employee":
      inputs = await employee.showUpdateMenu();

      managerId = null;
      if (inputs["manager"]) {
        const managerName = inputs["manager"].split(" ");
        managerId = (await employee.getByName(managerName[0], managerName[1]))
          .id;
      }

      selectedRole = await role.getByTitle(inputs["roleTitle"]);
      roleId = null;
      if (selectedRole) {
        roleId = selectedRole.id;
      }

      const updatedEmployee = {};
      updatedEmployee["id"] = inputs["id"];
      updatedEmployee["first_name"] = inputs["first"];
      updatedEmployee["last_name"] = inputs["last"];
      updatedEmployee["role_id"] = roleId;
      updatedEmployee["manager_id"] = managerId;

      result = await employee.update(updatedEmployee);
      if (result) console.log("successfully updated.");
      break;

    case "Remove a department":
      selectedDepartment = await department.showSelectDepartmentMenu();

      if (!selectedDepartment) {
        console.log("There isn't any department to delete.");
        break;
      }

      const deletedDepartmentId = (
        await department.getByName(selectedDepartment)
      ).id;

      result = await department.remove(deletedDepartmentId);
      if (result) console.log("Department deleted successfully.");
      break;

    case "Remove a role":
      selectedRole = await role.showSelectroleMenu();

      if (!selectedRole) {
        console.log("There isn't any role to delete.");
        break;
      }

      const deletedRoleId = (await role.getByTitle(selectedRole)).id;

      result = await role.remove(deletedRoleId);
      if (result) console.log("Role deleted successfully.");
      break;

    case "Remove an employee":
      selectedEmployee = await employee.showSelectEmployeeMenu(
        "Select an employee to delete:"
      );

      if (!selectedEmployee) {
        console.log("There isn't any employee to delete");
        break;
      }

      [firstName, lastName] = selectedEmployee.split(" ");
      const deletedEmployeeId = (await employee.getByName(firstName, lastName))
        .id;

      result = await employee.remove(deletedEmployeeId);
      if (result) console.log("Employee deleted successfully.");
      break;

    case "Exit":
      process.exit(0);
  }
  setTimeout(showMainMenu, 1000);
};

module.exports = showMainMenu;
