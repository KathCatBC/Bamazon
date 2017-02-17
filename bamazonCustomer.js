var mysql = require('mysql');
var inquirer = require('inquirer');
require("console.table");
var purchaseItem;
var purchaseQty;
var productAvailability;
var productCost;
var newStockLevel;


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'none',
    database : "bamazon_db",
  });

  connection.connect();

  connection.query('SELECT id, product_name, price from products', function (err, res, fields) {
       if (err) {
          return console.log("Oops the following error occurred: " + err);
        } else {
           console.log("  "); // added for console display neatness
           console.table(res);
 		       purchase();
        }           
      });


function buyMore(){

    console.log("  ");  // for screen neatness
    inquirer.prompt([
      {
        type: "list",
        name: "areYouDone",
        message: "What would you like to do?",
        choices: ["Buy more items", "Quit"]
      }
      ]).then(function(data){
        if (data.areYouDone == "Quit") {
          connection.end()
        } else {
          console.log("picked buyMore")
              connection.query('SELECT id, product_name, price from products', function (err, res, fields) {
           if (err) {
              return console.log("Oops the following error occurred: " + err);
            } else {
              console.log("  "); // added for console display neatness
              console.table(res);
              purchase();
            }           
          });
       }
    });
}  

function purchase(){

  inquirer.prompt([
    {type: "input",
      name: "id",
      message: "What is the ID number of the product you would like to purchase?"},
     {type: "input",
 		name: "quantity",
 		message: "How many to you want to purchase"}
  ]).then(function(data){

      purchaseItem = Number(data.id);
      purchaseQty = data.quantity;

			connection.query("SELECT stock_quantity, price FROM products WHERE ? ", {
  			id: purchaseItem	
				}, function(err, res) { 
    			if (err) {
    			 		return console.log("That product is not available");
    			} else {
    				productAvailability = res[0].stock_quantity;
            productCost = res[0].price;
    				
            if(productAvailability >= purchaseQty) {
                newStockLevel = productAvailability - purchaseQty

                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity : newStockLevel
                  }, {
                      id : purchaseItem
                  }], function(err, res) { 
                      if (err) return console.log(err);
                  });
                
                  connection.query("INSERT INTO sales  SET ?", {
                    product_id: purchaseItem,
                    quantity_purchased: purchaseQty
                  }, function(err, res) { 
                    if (err) {
                      console.log("Sorry an error occurred.")
                    } else {
                      console.log('   Purchase Completed! Total Cost is: $' + (productCost * purchaseQty) );
                      buyMore();
                    }
                  });

						} else {
              console.log("  "); // for screen neatness
							console.log("Sorry not enough stock");
              buyMore(); 
						}
      		};
				});  // end of connection.query
   		}); // end of then(function ....
     } // end of purchase