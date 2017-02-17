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
          choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product", "Quit"],
        }         
      ]).then(function(data){ 

        taskToDo = data.manageThis

        switch(taskToDo) {

          case "View Products for Sale":

             connection.query('SELECT * FROM products', function (err, res, fields) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("  "); // added for console display neatness
                  console.table(res);
                  manage();
                }
              });

              break;

          case "View Low Inventory":

             connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, res, fields) {
                if (err) {console.log(err);
                } else {
                  if (res[0] == undefined) {
                    console.log("  "); // added for console display neatness
                    console.log("    No low stock");
                    console.log("  "); // added for console display neatness
                    manage();
                  } else {   
                    console.log("  "); // added for console display neatness
                    console.table(res);
                    manage();
                  }
                }
              });

            break;

          case "Add to Inventory":

            connection.query('SELECT * FROM products', function (err, res, fields) {
                if (err) { 
                   return console.log(err);
                } else {
                    console.log("  "); // added for console display neatness
                    console.table(res);

                    inquirer.prompt([
                    {type: "input",
                    name: "id",
                    message: "What is the ID number of the product you would like to increase?"},
                    {type: "input",
                    name: "quantity",
                    message: "How many to you want to add?"}

                    ]).then(function(data){
                      var productId = Number(data.id);
                      var productQty = data.quantity;
                      var currentQty = 0;
        
                      // get the current stock quantity for the item selected
                      connection.query("SELECT stock_quantity FROM products WHERE ?", {
                      id: productId
                      }, function(err, res) { 
                      
                        if ((res.length == 0) || err) {

                          console.log(" "); // for screen neatness
                          console.log("  No item with that id.");
                          console.log(" "); // for screen neatness
                          manage();
                          return
                        } else {
                          currentQty = res[0].stock_quantity;
                        }
                      
                        productAvailability = res[0].stock_quantity + Number(productQty);

                        connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity : productAvailability
                        }, {
                        id : productId
                        }], function(err, res) { 

                          if (err) {
                            console.log("bad product id")
                            manage();
                          } else {
                            console.log('update completed!')
                            manage();
                          }
                      });
                  });
                });
              }  // end of else  to display current inventory
            })  // end of connection.query

          break;

          case "Add New Product":

                connection.query('SELECT * FROM departments', function (err, res, fields) {
                if (err) { 
                   return console.log(err);
                } else {
                    console.log("  "); // added for console display neatness
                    console.table(res);

                    inquirer.prompt([
                    {type: "input",
                    name: "id",
                    message: "What is the department ID number of the new product?"},
                    {type: "input",
                    name: "productName",
                    message: "What is the product you want to add?"},
                    {type: "input",
                    name: "productCost",
                    message: "What is the cost of the new product?"},
                    {type: "input",
                    name:  "productQty",
                    message:  "How many do you want to add to inventory"},                          
                    ]).then(function(data){

                      departmentId = data.id;
                      prodName = data.productName;
                      prodCost = Number(data.productCost);
                      prodQty = Number(data.productQty);

                      connection.query("INSERT INTO products SET ?", {
                        product_name: prodName,
                        department_id: departmentId,
                        price: prodCost,
                        stock_quantity: prodQty,
                        }, function(err, res) { 
                          console.log("   "); // 
                          console.log('product added - as long as you selected a valid department'  )
                          manage();
                    });
                }); // end of first inquirer
              }  // end of else  to display current inventory
            })  // end of connection.query

          break;

          case "Quit":
              connection.end();
          break;

          default:

            console.log("nothing to see here folks!")

          break;
          
        }
    
      });
 
    }