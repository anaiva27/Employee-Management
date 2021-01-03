const inquirer = require("inquirer");
require("console.table");
const util = require("util");
// const db = require("./db")
const mysql = require("mysql");
const { CLIENT_RENEG_LIMIT } = require("tls");

// logo?
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "27qweasd",
  database: "employees",
});

// connect to the mysql server and sql database
connection.query = util.promisify(connection.query);
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  mainPrompt();
});

// class with sql queries for employee, department, role manipulations
class DB {
  constructor(connection) {
    this.connection = connection;
  }
  viewAllEmployees() {
    return this.connection.query(`SELECT 
   employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary,
  CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN employee manager ON manager.id = employee.manager_id LEFT JOIN department ON roles.department_id = department.id`);
  }

  viewAllDepartments() {
    return this.connection.query(`SELECT * FROM department ORDER BY id`);
  }

  viewAllRoles() {
    return connection.query(
      `SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id ORDER BY roles.id`
    );
  }

  addNewEmployee() {}

  addNewDepartment(response){
     return this.connection.query(
        `INSERT INTO department (name) VALUE (?)`,
        response.newDepartment,
        function (err) {
          if (err) throw err;
        }
  )}

  addNewRole() {}

  updateTheRole() {}
}

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
        employees.push(`${res2.first_name} ${res2.last_name}`, res2.id);
        employeesId.push({name:`${res2.first_name} ${res2.last_name}`, value: res2.id});
      });
    }
  );
  connection.query("SELECT * FROM employee", function (err, res) {
    res.forEach((res2) => {
      if (err) throw err;
      if (!res2.manager_id) {
        managers.push(res2.first_name + " " + res2.last_name);
        managersId.push(res2.id);
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
      rolesId.push({name: res2.title, value:res2.id});
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
          name: "Add an employees",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Add a department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "Delete a department",
          value: "DELETE_DEPARTMENT",
        },
        {
          name: "Add a role",
          value: "ADD_ROLE",
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
        case "DELETE_DEPARTMENT":
          return deleteDepartment();
          break;
        case "ADD_ROLE":
          return addRole();
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

// function createTable(error, res) {
//   if (error) throw error;
//   console.table(res);
//   mainPrompt();
// }

let db = new DB(connection);

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
      choices: roles,
      name: "role",
    },
    {
      type: "list",
      message: `Who is the new employee's manager?`,
      choices: managers,
      name: "manager",
    },
  ];

  inquirer.prompt(questions).then(function (response) {
    createTable();
    //   }
    // );
  });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      message: "What department would you like to add?",
    })
    .then(function (response){ 
     
    db.addNewDepartment(response);
    
          console.log("----------");
          console.log("Department has been successfully added");
          console.log("----------");
    mainPrompt();
        })}
      
    


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
      }
    },
    {
      name: "departmentName",
      type: "list",
      message: "What is the name department for the new role?",
      choices: departments,
    },
  ];

  inquirer.prompt(questions).then(function (answer) {
    connection.query(
      `SELECT id FROM department WHERE name = ?`,
      answer.departmentName,
      function (err, res) {
        if (err) throw err;
        console.log(res);
        connection.query(
          `INSERT INTO roles SET ?`,
          {
            title: answer.newRole,
            salary: answer.salary,
            department_id: res[0].id,
          },
          function (err, res) {
            if (err) throw err;
            console.log("The new role has been added");
            createTable();
          }
        );
      }
    );
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
      connection.query(
        `DELETE FROM roles WHERE title = ?`,
        response.deleteRole,
        function (err) {
          if (err) throw err;
          console.log("----------");
          console.log("Role has been successfully removed");
          console.log("----------");
          mainPrompt();
        }
      );
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
  ]
  inquirer.prompt(roleUpdateQs).then(function (response) {
    console.log(response)
    // connection.query(SELECT )
    connection. query('UPDATE employee SET ? WHERE ?', 
        [
            {
                role_id: response.role
            },
            {
                id: response.employee   
            }
        ],

      function (err) {
        if (err) throw err;
        console.log("----------");
        console.log("Role has been successfully updated");
        console.log("----------");
        mainPrompt();
      })})}

     