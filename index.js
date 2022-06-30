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
    `SELECT employees.id AS ID, employees.firstName AS "FIRST NAME", employees.lastName AS "LAST NAME", roles.title AS ROLE, departments.departmentName AS DEPARTMENT, roles.salary AS SALARY, CONCAT(departmentManager.firstName, ' ', departmentManager.lastName) AS MANAGER FROM employees LEFT JOIN roles on employees.roles = roles.roleId LEFT JOIN departments on roles.departmentId = departments.departmentId LEFT JOIN employees departmentManager on departmentManager.id = employees.managerId;`
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
  let query =
  "INSERT INTO role (title, salary, departmentId) VALUES (?, ?, ?)";

db.query("SELECT * FROM departments", (err, res) => {
  if (err) console.log(err);

  inquirer.prompt([
      {
          type: "input",
          name: "title",
          message: "What is the name of the new role?",
      },
      {
          type: "input",
          name: "salary",
          messsage: "What is the salary of the role?",
      },
      {
          type: "list",
          name: "departmentId",
          message: "What is the department of the role?",
          choices: res.map((departments) => {
              return {
                  name: departments.departmentName,
                  value: departments.departmentId,
              };
          }),
      },
  ])
      .then((res) => {
          db.query(
              query,
              [res.title, res.salary, res.departmentId],
              (err, res) => {
                  if (err) {
                      console.log(err);
                      return;
                  }
                  console.log(`Role has been created\n`);
                  selectOption();
              }
          );
      });
});
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
        let mgrQuery = "SELECT * FROM employees WHERE departmentManager NOT NULL;";
    /*db.query(mgrQuery, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            mgrArr.push(res[i].firstName + " " + res[i].lastName)
          }
    })*/
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
  let query = "UPDATE employee SET roleId = ? WHERE id = ?";
  let empID;

  db.query("SELECT * FROM employees", (err, res) => {
      if (err) console.log(err);
      
      inquirer.prompt([
          {
              type: "list",
              name: "id",
              message: "Which employee would you like to change to a new role?",
              choices: res.map((employees) => {
                  return {
                      name: employees.firstName + " " + employees.lastName,
                      value: employees.id,
                  };
              }),
          },
      ]).then((res) => {
          empID = res.id;
          db.query("SELECT * FROM roles", (err, res) => {
              if (err) console.log(err);
              
              inquirer.prompt([
                  {
                      type: "list",
                      name: "roleId",
                      message: "Which role do you want to assign to the employee?",
                      choices: res.map((roles) => {
                          return {
                              name: roles.title,
                              value: roles.roleId,
                          };
                      }),
                  },
              ])
                  .then((res) => {
                      db.query(query, [res.roleId, empID], (err, res) => {
                          if (err) console.log(err);
                          console.log("Employee role has been updated\n");
                          selectOption();
                      });
                  });
          });
      });
  })
};

function quit(){
  console.log("Bye...\n");
  process.exit();
};