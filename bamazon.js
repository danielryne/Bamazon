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

  printProducts();

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

// Prints all products to the screen 
function printProducts() {
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
    "UPDATE products SET quantity = '?' WHERE product_name = '?'", [newQuantity, product],
    function(error, result) {
      console.log("Products updated!");
    }
  );
  connection.end();
}

// Creates a new product 
function createProduct(product, quantity) {
  var query = connection.query(
    "INSERT INTO products SET ?",
    {
      flavor: "Rocky Road",
      price: 3.0,
      quantity: 50
    },
    function(error, result) {
      console.log(quantity + " " + " added to inventory.");
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

// Deletes a product 
function deleteProduct(product) {
  console.log("Deleting product...\n");
  connection.query(
    "DELETE FROM products WHERE ?",
    {
      flavor: product
    },
    function(error, result) {
      console.log(res.affectedRows + " products deleted!\n");
    }
  );
}