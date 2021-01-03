const inquirer = require("inquirer");
require("console.table");
const DB = require("./class")
const connection = require('./db/connection.js');

// run the start function after the connection is made to prompt the user
mainPrompt();

function mainPrompt() {
  employees = [];
  employeesId = [];
  roles = [];
  rolesId = [];
  departments = [];
  departmentsId = [];
  managers = [];
  managersId = [];
  connection.query(
    "SELECT * FROM employee ORDER BY employee.id",
    function (err, res) {
      if (err) throw err;
      res.forEach((res2) => {
        employees.push(`${res2.first_name} ${res2.last_name}`);
        employeesId.push({
          name: `${res2.first_name} ${res2.last_name}`,
          value: res2.id,
        });
      });
    }
  );
  connection.query("SELECT * FROM employee", function (err, res) {
    res.forEach((res2) => {
      if (err) throw err;
      if (!res2.manager_id) {
        managers.push(`${res2.first_name} ${res2.last_name}`);
        managersId.push({
          name: res2.first_name + " " + res2.last_name,
          value: res2.id,
        });
      }
    });
  });
  connection.query(
    "SELECT * FROM department ORDER BY department.id",
    function (err, res) {
      if (err) throw err;
      res.forEach((res2) => {
        departments.push(res2.name);
        departmentsId.push(res2.id);
      });
    }
  );
  connection.query("SELECT * FROM roles", function (err, res) {
    res.forEach((res2) => {
      if (err) throw err;
      roles.push(res2.title);
      rolesId.push({ name: res2.title, value: res2.id });
    });
  });

  inquirer
    .prompt({
      type: "list",
      name: "choices",
      message: "What do you want to do?",
      choices: [
        {
          name: "View all employees",
          value: "VIEW_EMPLOYEES",
        },
        {
          name: "View all departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "View all roles",
          value: "VIEW_ROLES",
        },
        {
          name: "Add an employee",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Add a department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "Add a role",
          value: "ADD_ROLE",
        },
        {
          name: "Delete a department",
          value: "DELETE_DEPARTMENT",
        },
        {
          name: "Delete an employee",
          value: "DELETE_EMPLOYEE",
        },
        {
          name: "Delete a role",
          value: "DELETE_ROLE",
        },
        {
          name: "Update a role",
          value: "UPDATE_ROLE",
        },
        {
          name: "Exit the application",
          value: "EXIT_APP",
        },
      ],
    })
    .then(function (response) {
      switch (response.choices) {
        case "VIEW_EMPLOYEES":
          return viewEmployees();
          break;
        case "VIEW_DEPARTMENTS":
          return viewDepartments();
          break;
        case "VIEW_ROLES":
          return viewRoles();
          break;
        case "ADD_EMPLOYEE":
          return addEmployee();
          break;
        case "ADD_DEPARTMENT":
          return addDepartment();
          break;
        case "ADD_ROLE":
          return addRole();
          break;
        case "DELETE_DEPARTMENT":
          return deleteDepartment();
          break;
        case "DELETE_EMPLOYEE":
          return deleteEmployee();
          break;
        case "DELETE_ROLE":
          return deleteRole();
          break;
        case "UPDATE_ROLE":
          return updateRole();
          break;
        case "EXIT_APP":
          connection.end();
          return console.log("You have exited the application");
          break;
      }
    });
}

// creating database object
let db = new DB(connection);

// functions for the switch statements values
async function viewEmployees() {
  const employees = await db.viewAllEmployees();
  console.table(employees);
  mainPrompt();
}

async function viewDepartments() {
  const employees = await db.viewAllDepartments();
  console.table(employees);
  mainPrompt();
}

async function viewRoles() {
  const employees = await db.viewAllRoles();
  console.table(employees);
  mainPrompt();
}

function addEmployee() {
  managersId.push({ name: "no manager", value: null });
  let questions = [
    {
      type: "input",
      message: `What is the first name?`,
      name: "firstName",
    },
    {
      type: "input",
      message: `What is the last name?`,
      name: "lastName",
    },
    {
      type: "list",
      message: `What is the new employee's role?`,
      choices: rolesId,
      name: "role",
    },
    {
      type: "list",
      message: `Who is the new employee's manager?`,
      choices: managersId,
      name: "manager",
    },
  ];

  inquirer.prompt(questions).then(function (response) {
    db.addNewEmployee(response);
    console.log("----------");
    console.log("The new employee has been added");
    console.log("----------");
    mainPrompt();
  });
}

function deleteEmployee() {
  inquirer
    .prompt({
      name: "deleteEmployee",
      type: "list",
      message: "What is the name of the employee you would like to delete?",
      choices: employeesId,
    })
    .then(function (response) {
      db.deleteAnEmployee(response);
      console.log("----------");
      console.log("Employee has been successfully removed");
      console.log("----------");
      mainPrompt();
    });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      message: "What department would you like to add?",
    })
    .then(function (response) {
      db.addNewDepartment(response);

      console.log("----------");
      console.log("Department has been successfully added");
      console.log("----------");
      mainPrompt();
    });
}

function deleteDepartment() {
  inquirer
    .prompt({
      name: "deleteDepartment",
      type: "list",
      message: "What is the name of the department you would like to delete?",
      choices: departments,
    })
    .then(function (response) {
      connection.query(
        `DELETE FROM department WHERE name = ?`,
        response.deleteDepartment,
        function (err) {
          if (err) throw err;
          console.log("----------");
          console.log("Department has been successfully removed");
          console.log("----------");
          mainPrompt();
        }
      );
    });
}

function addRole() {
  let questions = [
    {
      name: "newRole",
      type: "input",
      message: "What is the name of the new role?",
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary?",
      validate: function (salary) {
        return !isNaN(salary);
      },
    },
    {
      name: "departmentName",
      type: "list",
      message: "What is the name department for the new role?",
      choices: departments,
    },
  ];
  inquirer.prompt(questions).then(function (answer) {
    db.addNewRole(answer);
    console.log("----------");
    console.log("Role has been successfully added");
    console.log("----------");
    mainPrompt();
  });
}

function deleteRole() {
  inquirer
    .prompt({
      name: "deleteRole",
      type: "list",
      message: "What is the role you would like to remove?",
      choices: roles,
    })
    .then(function (response) {
      db.deleteARole(response);
      console.log("----------");
      console.log("Role has been successfully removed");
      console.log("----------");
      mainPrompt();
    });
}

function updateRole() {
  let roleUpdateQs = [
    {
      name: "employee",
      type: "list",
      message: "What is the name of the employee?",
      choices: employeesId,
    },
    {
      name: "role",
      type: "list",
      message: "What is the new role?",
      choices: rolesId,
    },
  ];
  inquirer.prompt(roleUpdateQs).then(function (response) {
    db.updateARole(response);
    console.log("----------");
    console.log("Role has been successfully updated");
    console.log("----------");
    mainPrompt()
  });
}
