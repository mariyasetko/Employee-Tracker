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
  let query = "INSERT INTO departments (departmentName) VALUES (?)";
  let params = [];
  inquirer.prompt([
      {
          type: "input",
          name: "deptname",
          message: "What is the name of the new department?",
      },
  ])
      .then((res) => {
          params.push(res.deptname);
          db.query(query, params, (err, res) => {
              if (err) console.log(err);
              console.log(`Added ${params} Department.\n`);
              selectOption();
          });
      });
};

function addRole(){

};

function addEmployee(){
    let roleArr = [];
    let roleQuery = "SELECT roles.title FROM roles;";
    db.query(roleQuery, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            roleArr.push(res[i].title)
        }
    })
        let mgrArr = [];
        let mgrQuery = "SELECT * FROM employees WHERE departmentManager IS NOT NULL;";
    db.query(mgrQuery, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            mgrArr.push(res[i].firstName + " " + res[i].lastName)
        }
    })
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is your employees first name?',
                    name: "firstname"
                },
                {
                    type: 'input',
                    message: 'What is your employees last name?',
                    name: "lastname"
                },
                {
                    type: "list",
                    message: "Choose your employee's role",
                    name: "role",
                    choices: roleArr
                },
                {
                    type: "list",
                    message: "Choose your employee's manager",
                    name: "manager",
                    choices: mgrArr
                },
            ]).then(function (response) {
                console.log("\nBuilding New Employee...\n");
                let addEmployeeRole = response.roles;
                let addManager = response.manager;
                let addEmployeeRoleId = roleArr.indexOf(addEmployeeRole);
                let addManagerId = mgrArr.indexOf(addManager);
                addEmployeeRoleId++;
                addManagerId++;
                db.query("INSERT INTO employees SET ?",
                    {
                        firstName: response.firstName,
                        lastName: response.lastName,
                        roleId: addEmployeeRoleId,
                        departmentManager: addManagerId
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log("Employee Created Succesfully\n");
                        selectOption();
                    });
            });
};

function updateEmployee(){

};

function quit(){
  console.log("Bye...\n");
  process.exit();
};