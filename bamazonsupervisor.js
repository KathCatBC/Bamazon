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
          choices: ["Create New Department","View Product Sales by Department", "Quit"],
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
                          }, function(err, res) { 
                            console.log('product added')
                            console.log("  ") // for screen spacing
                            manage();
                          });
                    })
                }
              });

              break;

          case "View Product Sales by Department":
   
            var queryStr = 'SELECT departments.id, departments.department_name, sum(sales.quantity_purchased * departments.over_head_costs)'
                queryStr += ' as over_head_costs, sum((sales.quantity_purchased * products.price)) as product_sales, '
                queryStr += ' sum((sales.quantity_purchased * products.price) - (sales.quantity_purchased * departments.over_head_costs)) as total_profit';
                queryStr += ' FROM products, sales, departments WHERE (sales.product_id = products.id AND products.department_id = departments.id)';
                queryStr += ' GROUP BY products.department_id ORDER BY products.department_id';

            connection.query(queryStr, function (err, res, fields) {
                if (err) {
                    console.log(err);
                } else {
                  console.log("  ");  // just to add spacing to the console;
                  console.table(res);
                  manage();
                }
              });

          break;


          case "Quit":

            connection.end();
          break;

          default:
            console.log("nothing to see here folks!")
          break
        }    
      });
    }

  