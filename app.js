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
  password: "",
  database: "employees",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  mainPrompt();
});

class Db {
  constructor(connection){
this.connection = connection
  };

// employee, department, role manipulation methods
viewAllEmployees(){
  return this.connection.query("SELECT * FROM employees.roles" )}

viewAllDepartments(){

};

viewAllRoles(){

};

addNewEmployee(){

};

addNewDepartment(){

};

addNewRole(){

};

updateTheRole(){

};

exitTheApp(){

};

// findManager(){}
}

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
          name: "Delete a department",
          value: "DELETE_DEPARTMENT",
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
        case "UPDATE_ROLE":
          return updateRole();
          break;
        case "EXIT_APP":
          return exitApp();
          break;
      }
    });
}

function createTable(error, res) {
  if (error) throw error;
  console.table(res);
  mainPrompt();
}

// let db = new Db(connection);

// async 
function viewEmployees() {
//   const [employees] = await db.viewAllEmployees();
// console.log(employees)
//   console.table(employees);
//   mainPrompt()
  connection.query(
    `SELECT 
    employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary,
    CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN employee manager ON manager.id = employee.manager_id LEFT JOIN department ON roles.department_id = department.id`
     , createTable 
  );
}

function viewDepartments(){
  connection.query(`SELECT * FROM department`, createTable)
};

function viewRoles(){
  connection.query(`SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id`, createTable)
};

function addEmployee(){
  inquirer.prompt({
    name: "newEmployee",
    type: "input",
    message: "What department would you like to add?"
  }).then(function(response){
    connection.query(`INSERT INTO department (name) VALUES (?)`, response.newDepartment, function (err)  {
      if (err) throw err;
      createTable();})
  })
};

function addDepartment(){
  inquirer.prompt({
    name: "newDepartment",
    type: "input",
    message: "What department would you like to add?"
  }).then(function(response){
    connection.query(`INSERT INTO department (name) VALUES (?)`, response.newDepartment, function (err)  {
      if (err) throw err;
      createTable();})
  })
};

function deleteDepartment(){
  inquirer.prompt({
    name: "deleteDepartment",
    type: "input",
    message: "What is the ID of department you would like to delete?"
  }).then(function(response){
    connection.query(`DELETE FROM department WHERE id = ?`, response.deleteDepartment, function (err)  {
      if (err) throw err;
      console.log("----------");
      console.log("Department has been removed")
      console.log("----------");
      mainPrompt();})
  })
}

function addRole(){
  inquirer.prompt({
    name: "newDepartment",
    type: "input",
    message: "What department would you like to add?"
  }).then(function(response){
    connection.query(`INSERT INTO department (name) VALUES (?)`, response.newDepartment, function (err)  {
      if (err) throw err;
      createTable();})
  })
};

function updateRole(){};

function exitApp(){};