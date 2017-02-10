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
          name: "manageThis",
          message: "What would you like to do",
          choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product"],
        }         
      ]).then(function(data){ 

        taskToDo = data.manageThis

        console.log(taskToDo);

        switch(taskToDo) {

          case "View Products for Sale":

             connection.query('SELECT * FROM products', function (error, results, fields) {
                if (error) console.log(error);
                console.table(results);
              });

              break;

          case "View Low Inventory":

             connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (error, results, fields) {
                if (error) console.log(error);
                console.table(results);
              });

            break;

          case "Add to Inventory":

            connection.query('SELECT * FROM products', function (error, results, fields) {
                if (error) { 
                   return console.log(error);
                } else {

                    console.table(results);

                    inquirer.prompt([
                    {type: "input",
                    name: "id",
                    message: "What is the ID number of the product you would like to increase?"},
                    {type: "input",
                    name: "quantity",
                    message: "How many to you want to add?"}

                    ]).then(function(data){
                      productId = data.id;
                      productQty = data.quantity;
                      // get the current stock quantity for the item selected
                      connection.query("SELECT stock_quantity, price FROM products WHERE ? ", {
                      id: productId
                      }, function(err, res) { 
                      if (err) {
                          return console.log("Invalid Product ID");
                      } else {
                          productAvailability = res[0].stock_quantity + Number(productQty);

                          connection.query("UPDATE products SET ? WHERE ?", [{
                          stock_quantity : productAvailability
                          }, {
                          id : productId
                          }], function(err, res) { 
                          if (err) {
                            return console.log(err);
                          } else {
                            console.log('update completed!')
                          }
                        });
                      }
                  });
                });
              }  // end of else  to display current inventory
            })  // end of connection.query

          break;

          // case "Add New Product"

          // break;

          default:

            console.log("nothing to see here folks!")

          break;

        }



        console.log(data.manageThis) 











      })
   










    }