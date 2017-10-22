DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;
USE bamazon;

CREATE TABLE products(
item_id INT(11) AUTO_INCREMENT NOT NULL, 
product_name VARCHAR(100), 
department_name VARCHAR(100), 
price DECIMAL(10, 2) NULL, 
stock_quantity INT (100),
PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('pokeball', 'balls', 5.00, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('greatball', 'balls', 10.00, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('ultraball', 'balls', 20.00, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('potion', 'potions', 5.00, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('super_potion', 'potions', 10.00, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('hyper_potion', 'potions', 20.00, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('razz_berry', 'berries', 5.00, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('nanab_berry', 'berries', 7.00, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('pinap_berry', 'berries', 7.00, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('incubator', 'special', 100.00, 5);

SELECT * FROM products;
