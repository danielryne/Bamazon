// Required node packages 
var mysql = require("mysql");
var inquirer = require("inquirer"); 

// Connecting to the local database 
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

// Connect to database 
connection.connect(function(error) {
  if (error) throw error;
  console.log("Connected to Bamazon! Thread ID: " + connection.threadId);

  // Prints products and then sends the function a callback that will prompt the use for a response 
  printProducts(function () {

	  inquirer.prompt([
	    {
	      type: "input",
	      name: "product",
	      message: "Which product would you like to buy today?"
	    },
	    {
	      type: "input",
	      name: "quantity",
	      message: "How many would like to buy?",
	    }  
	  ]).then(function(response) {

	    makeOrder(response.product, response.quantity);  
	 
	  }); // Ends inquirer prompt 
  });

});

// Prints all products to the screen 
function printProducts(callback) {
  console.log("Here's what's in stock: \n");

  connection.query("SELECT * FROM products", function(error, result) {
    if (error) throw error;

    //Prints table header 
    console.log("ID" + "\t" + "Product" + "\t" + "Department" + "\t" + "Price ($)" + "\t" + "Stock");

    // Logs the results to the concole 
    for (i = 0; i < result.length; i++){
      console.log(
        result[i].item_id + "\t" + 
        result[i].product_name + "\t" +
        result[i].department_name + "\t" +
        result[i].price + "\t" + 
        result[i].stock_quantity
      );
    }
    console.log('\n')
    callback();

  });
}

function makeOrder(product, quantity){
  connection.query("SELECT * FROM products", function(error, result) {
    if (error) throw error;

    //Flag to let us know the item was found 
    var itemFound = false; 

    // Loop to look through the products 
    for (i = 0; i < result.length; i++){

      // Checks to see if the product name matches user input  
      if (result[i].product_name == product){

        itemFound = true; 

        // Check quantity of item (only if item was found)
        if (result[i].stock_quantity >= quantity){

          console.log("Great, we do have " + quantity + " " + product + ". We'll get those ready for you.");
          
          // Calcluates new quanity of product based on order 
          var newQuantity = result[i].stock_quantity - quantity; 

          //Updates the product in the database 
          updateProduct(product, newQuantity);
        }
        else{
          console.log("Insufficient quantity of " + product + ". Please try again with a smaller quantity.")
          connection.end();
        }
      } 
    } //Ends for loop to look for items 

    if (itemFound === false){
      console.log("Item is not in stock. Please check out our other items and try again.");
      connection.end();
    }

  }); // Ends connection query 
}


// Updates quantity of the product 
function updateProduct(product, newQuantity) {
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newQuantity
              },
              {
                product_name: product
              }
            ],
    function(error, result) {
      console.log("Products updated!");
    }
  );
  connection.end();
}


