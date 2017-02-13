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

  connection.query('SELECT id, product_name, price from products', function (error, results, fields) {
       if (error) {
          throw error;
        } else {
          console.log("  "); // added for console display neatness
          console.table(results);
 		       purchase();

           // console.log("line after calling purchase function") this show up before purchase made
           // connection.end();
        }           
      });

function purchase(){
      inquirer.prompt([
        {type: "input",
          name: "id",
          message: "What is the ID number of the product you would like to purchase?"},
         {type: "input",
     		name: "quantity",
     		message: "How many to you want to purchase"}
      ]).then(function(data){
	            // selectTable(products);
	            console.log(data.id);
	            console.log(data.quantity);
	            purchaseItem = Number(data.id);
	            console.log("purchaseItem = "+ purchaseItem)
	            purchaseQty = data.quantity;


   				connection.query("SELECT stock_quantity, price FROM products WHERE ? ", {
        			id: purchaseItem	
      				}, function(err, res) { 
          			if (err) {
          			 		return console.log("That product is not available");
          			} else {
          				productAvailability = res[0].stock_quantity;
                  productCost = res[0].price;
          				console.log("productAvailability=" + productAvailability)
                  console.log("price = " + productCost)
						if(productAvailability >= purchaseQty) {
							// console.log("can purchase")
              // deduct amount from products table
              newStockLevel = productAvailability - purchaseQty
//write update function
// function updateTable(id, table){
    connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity : newStockLevel
      }, {
          id : purchaseItem
      }], function(err, res) { 
          if (err) return console.log(err);
          console.log('update completed!')
      });
// }


              
            connection.query("INSERT INTO sales  SET ?", {
              product_id: purchaseItem,
              quantity_purchased: purchaseQty
            }, function(err, res) { 
              console.log('Purchase Completed! Total Cost is: ' + (productCost * purchaseQty) );
              console.log("line after purchase complete") // put recursion here;
            });
// }
						} else {
							console.log("Sorry not enough stock");
              console.log("line after not enough stock") // put recursion here;
						}

            // console.log("line after insertinto sale")  not the place for the recursion!!

      				};
				});  // end of connection.query
   			}); // end of then(function ....


       // console.log("last line of purchase")  shows up before end of purchase function
      // connection.end();
 } // end of purchase
// });

