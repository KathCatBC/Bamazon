var mysql = require('mysql');
var inquirer = require('inquirer');
require("console.table");

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'none',
    database : "bamazon_db",
  });

connection.connect();

manage();

function manage(){
      inquirer.prompt([
        {type: "list",
          name: "superviseThis",
          message: "What would you like to do",
          choices: ["Create New Department","View Product Sales by Department"],
        }         
      ]).then(function(data){ 

        taskToDo = data.superviseThis

        switch(taskToDo) {

          case "Create New Department":

             connection.query('SELECT * FROM departments', function (err, res, fields) {
                if (err) {
                    console.log(err);
                } else {
                  console.log("  ");  // just to add spacing to the console;
                  console.table(res);

                  inquirer.prompt([
                    {type: "input",
                    name: "deptName",
                    message: "What is the name of the department to add?"},
                    {type: "input",
                    name: "overCost",
                    message: "What is the overhead cost for the new department?"}
                    ]).then(function(data){
                      dName = data.deptName;
                      dCost = Number(data.overCost);

                         connection.query("INSERT INTO departments SET ?", {
                            department_name: dName,
                            over_head_costs: dCost,
            }, function(err, res) { console.log('product added'  )});

                    })

                }
              });

              break;

          case "View Product Sales by Department":

              console.log("sorry, this feature has not been implemented yet")
              

          break;

          default:

            console.log("nothing to see here folks!")

          break;
          
        }
        // This does not work here add to inventory and add new product fail

       // connection.end();
      })
 
    }

  