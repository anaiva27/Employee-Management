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
  
    addNewEmployee(response) {
      this.connection.query(
        `INSERT INTO employee SET ?`,
        {
          first_name: response.firstName,
          last_name: response.lastName,
          role_id: response.role,
          manager_id: response.manager,
        },
        function (err, res) {
          if (err) throw err;
        }
      );
    }
  
    addNewDepartment(response) {
      return this.connection.query(
        `INSERT INTO department (name) VALUE (?)`,
        response.newDepartment,
        function (err) {
          if (err) throw err;
        }
      );
    }
  
    addNewRole(answer) {
      this.connection.query(
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
            }
          );
        }
      );
    }
  
    deleteAnEmployee(response) {
      connection.query(
        `DELETE FROM employee WHERE id = ?`,
        response.deleteEmployee,
        function (err) {
          if (err) throw err;
        }
      );
    }
  
    deleteARole(response) {
      this.connection.query(
        `DELETE FROM roles WHERE title = ?`,
        response.deleteRole,
        function (err) {
          if (err) throw err;
        }
      );
    }
  
    updateARole(response) {
      this.connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: response.role,
          },
          {
            id: response.employee,
          },
        ],
  
        function (err) {
          if (err) throw err;
        }
      );
    }
  }

  module.exports = DB;