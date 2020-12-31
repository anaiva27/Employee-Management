const inquirer = require("inquirer");
require("console.table");
// const db = require("./db")
const mysql = require("mysql");

// logo?
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "27qweasd",
  database: "employees"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
   mainPrompt()
});

// class Db {
//   constructor(connection){ 
// this.connection = connection
//   };

// // employee, department, role manipulation methods
// viewAllEmployees(){
//   return this.connection.query( "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, roles.title, roles.salary, role.departmnent_id CONCAT(employee.manager_id)")}

// viewAllDepartments(){

// };
 
// viewAllRoles(){

// };
 
// addNewEmployee(){

// };
 
// addNewDepartment(){

// };
  
// addNewRole(){

// };
 
// updateTheRole(){

// };
   
// exitTheApp(){
  
// };

// // findManager(){}
// }

function mainPrompt() {
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
          name: "Add a role",
          value: "ADD_ROLE",
        },
        {
          name: "Update a role",
          value: "UPDATE_ROLE",
        },
        {
          name: "Exit the application",
          value: "EXIT_APP",
        } 
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
        case "UPDATE_ROLE":
            return updateRole();
            break;
        case "EXIT_APP":
          return exitApp();
          break;
      }
    });
}

function viewEmployees(){
  // const employees = await db.viewAllEmployees();
  connection.query("SELECT * FROM employees.roles", createTable
  //  "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary CONCAT(employee.manager_id)"
   )

  // console.log("\n");
  // console.log(employees);
  // console.table(employees);
  // mainPrompt()
}

function createTable(error, res) {
  if (error) throw error;
  console.table(res);
  mainPrompt();
}
