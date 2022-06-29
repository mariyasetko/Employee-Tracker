// get the client
const db = require("./scripts/connection.js");
const cTable= require('console.table');
const inquirer = require('inquirer');

db.connect(err => {
  if (err) throw err;
  console.log('Connected to employees database');
  selectOption();
});

const selectOption = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Departments",
          value: "VIEW-DEPTS"
        },
        {
          name: "View All Roles",
          value: "VIEW-ROLES"
        },
        {
          name: "View All Employees",
          value: "VIEW-EMPLOYEES"
        },
        {
          name: "Add a Department",
          value: "ADD-DEPT"
        },
        {
          name: "Add a Role",
          value: "ADD-ROLE"
        },
        {
          name: "Add an Employee",
          value: "ADD-EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
  }

]).then(res => {
    let choice = res.choice;
    switch (choice){
      case "VIEW-DEPTS":
        viewDepartments();
        break;
      case "VIEW-ROLES":
          viewRoles();
          break;
      case "VIEW-EMPLOYEES":
        viewEmployees();
        break;
      case "ADD-DEPT":
        addDepartment();
        break;
      case "ADD-ROLE":
        addRole();
        break;
      case "ADD-EMPLOYEE":
        addEmployee();
        break;
      case "UPDATE":
        updateEmployee();
        break;

      default:
        quit();
    }
  }
)};

function viewDepartments(){
  db.query(
    `SELECT departments.departmentId AS ID, departments.departmentName AS DEPARTMENTS FROM departments;`
    , function (err, results) {
        console.table(results);
        selectOption();
        console.table(`\n`);
    });
};

function viewRoles(){
  db.query(
      `SELECT roles.roleId AS ID, roles.title AS ROLES FROM roles;`
      , function (err, results) {
          console.table(results);
          selectOption();
          console.table(`\n`);
        }
  )
};

function viewEmployees(){
  db.query(
    `SELECT employees.id AS ID, employees.firstName AS "FIRST NAME", employees.lastName AS "LAST NAME", roles.title AS ROLE, departments.departmentName AS DEPARTMENT, roles.salary AS SALARY, CONCAT(departmentManager.firstName, ' ', departmentManager.lastName) AS MANAGER FROM employees LEFT JOIN roles on employees.roleId = roles.roleId LEFT JOIN departments on roles.departmentId = departments.departmentId LEFT JOIN employees departmentManager on departmentManager.id = employees.managerId;`
    , function (err, results) {
        console.table(results);
        selectOption();
        console.table(`\n`);
    });
};

function addDepartment(){

};

function addRole(){

};

function addEmployee(){

};

function quit(){
  console.log("Bye...\n");
  process.exit();
};