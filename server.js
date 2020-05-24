//jshint esversion:6
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "empDb"
});


connection.connect(function (err) {
    if (err) throw err;
    inquire();
});


function inquire() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View departments",
                "Add department",
                "Delete department",
                "View roles",
                "Add role",
                "Delete role",
                "View employees",
                "Add employee",
                "Delete employee",
                "Update employee",
                "View employees by manager",
                "View budget by department"
            ]
        })
        .then((answers) => {
            switch (answers.action) {
                case "View departments":
                    viewDepts();
                    break;
                case "Add department":
                    addDept();
                    break;
                case "Delete department":
                    delRow("department");
                    break;
                case "View roles":
                    viewRoles();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Delete roles":
                    delRow("role");
                    break;
                case "View employees":
                    viewEmps();
                    break;
                case "Add employee":
                    addEmp();
                    break;
                case "Delete employee":
                    delRow("employee");
                    break;
                case "Update employees":
                    updEmp();
                    break;
                case "View employees by manager":
                    viewEmpMgr();
                    break;
                case "View budget by department":
                    viewBudget();
                    break;
            }
        });
}

let qryDept = "SELECT * FROM department;";
const qryRole = "SELECT a.id, a.title, a.salary, b.name AS `department` FROM role a JOIN department b ON a.department_id = b.id;";
let qryEmp = "SELECT a.id, a.first_name, a.last_name, b.title, d.name as `department`, IFNULL(CONCAT(c.first_name,' ',c.last_name),'none') as `manager` FROM employee ";
qryEmp += "a JOIN role b ON a.role_id = b.id ";
qryEmp += "LEFT JOIN employee c ON a.manager_id = c.id ";
qryEmp += " JOIN department d ON b.department_id = d.id";

function viewDepts() {
    connection.query(qryDept, function (err, res) {
        if (err) throw err;
        console.table("Departments", res);
        inquire();
    });
}

function addDept() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the name of the new department?"
        })
        .then(function (answer) {
            var query = "INSERT INTO department SET ?";
            connection.query(query, {
                name: answer.name
            }, function (err, res) {
                if (err) throw err;

                viewDepts();
            });
        });
}

function viewRoles() {
    connection.query(qryRole, function (err, res) {
        if (err) throw err;
        console.table("Roles", res);
        inquire();
    });
}

function addRole() {
    inquirer
        .prompt([{
            name: "title",
            type: "input",
            message: "What is the title of the new role?"
        }, {
            name: "salary",
            type: "input",
            message: "What is the salary of the new role?"
        }, {
            name: "department_id",
            type: "input",
            message: "What is the Department ID of the new role?"
        }])
        .then(function (answer) {
            var query = "INSERT INTO role SET ?";
            connection.query(query, {
                title: answer.title,
                salary: parseFloat(answer.salary),
                department_id: parseInt(answer.department_id)
            }, function (err, res) {
                if (err) throw err;

                viewRoles();
            });
        });
}

function viewEmps() {
    connection.query(qryEmp, function (err, res) {
        if (err) throw err;
        console.table("Employees", res);
        inquire();
    });
}

function addEmp() {
    inquirer
        .prompt([{
            name: "first_name",
            type: "input",
            message: "What is the first name of the new employee?"
        }, {
            name: "last_name",
            type: "input",
            message: "What is the last name of the new employee?"
        }, {
            name: "role_id",
            type: "input",
            message: "What is the role ID of the new employee?"
        }, {
            name: "manager_id",
            type: "input",
            message: "What is the employee ID of the new employee's manager (if any?)?"
        }])
        .then(function (answer) {
            var query = "INSERT INTO employee SET ?";
            connection.query(query, {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: parseInt(answer.role_id),
                manager_id: parseInt(answer.manager_id)
            }, function (err, res) {
                if (err) throw err;

                viewEmps();
            });
        });
}

function delRow(table) {
    let query;

    switch (table) {
        case "department":
            query = qryDept;
            break;
        case "role":
            query = qryRole;
            break;
        case "employee":
            query = qryEmp;
            break;
    }

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table("Enter an ID to delete:", res);
    });

    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Enter the ID of a row to delete:",
        }]).then((answers) => {
            const qryDel = "DELETE FROM " + table + " WHERE ID = " + answers.id;
            connection.query(qryDel, function (err, res) {
                if (err) throw err;
            });

            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log("ID " + answers.id + " deleted.");
            });

            inquire();
        });
}

function updEmp() {
    connection.query(qryEmp, function (err, res) {
        if (err) throw err;
        console.table("Enter an ID to update:", res);
    });

    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Enter the ID of the employee that you would like to update:",
        }, {
            name: "column",
            type: "rawlist",
            message: "What would you like to change about this employee?",
            choices: [
                "role",
                "manager",
            ]
        }])
        .then((answers) => {
            const column = answers.column;
            const empID = answers.id;


            switch (column) {
                case "role":
                    connection.query(qryRole, function (err, res) {
                        if (err) throw err;
                        console.table("Roles", res);
                    });
                    break;
                case "manager":
                    connection.query(qryEmp, function (err, res) {
                        if (err) throw err;
                        console.table("Managers", res);
                    });
                    break;
            }

            inquirer
                .prompt([{
                    name: "id",
                    type: "input",
                    message: "Enter the ID of the " + column + " that you would like to assign the employee to:",
                }]).then(function (answer) {
                    let qryUpd;

                    if (answer.id === "") {
                        qryUpd = "UPDATE employee SET " + column + "_id = null";
                    } else {
                        qryUpd = "UPDATE employee SET " + column + "_id = " + parseInt(answer.id);
                    }

                    qryUpd += " WHERE id = " + empID;

                    connection.query(qryUpd, function (err, res) {
                        if (err) throw err;
                    });

                    connection.query(qryEmp, function (err, res) {
                        if (err) throw err;
                        console.table("Employees", res);
                        inquire();
                    });
                });

        });
}

function viewEmpMgr() {
    connection.query(qryEmp, function (err, res) {
        if (err) throw err;
        console.table("Enter an ID to update:", res);
    });

    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Enter the ID of the manager whose employees you'd like to see:",
        }])
        .then((answers) => {
            let qryMgr = qryEmp + " WHERE manager_id = " + parseInt(answers.id);
            connection.query(qryMgr, function (err, res) {
                if (err) throw err;
                console.table("Employees that report to the selected manager:", res);
                inquire();
            });
        });
}

function viewBudget() {
    const qryBudget = "SELECT a.name AS `Department`, SUM(b.salary) AS `Budget` FROM department a JOIN `role` b on a.id = b.department_id JOIN employee c on b.id = c.role_id GROUP BY a.name;";
    connection.query(qryBudget, function (err, res) {
        if (err) throw err;
        console.table("Budget by Department", res);
        inquire();
    });
}