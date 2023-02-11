const SQL = require('./db');
const path = require('path');
const csv=require('csvtojson');

//users
const CreateUsers = (req,res)=>{
    var Q_create_users = "CREATE TABLE Users (email VARCHAR(255), password VARCHAR(255), address VARCHAR(255), full_name VARCHAR(255), PRIMARY KEY (email))";
    SQL.query(Q_create_users,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating Users table"});
            return;
        }
        console.log('created Users table');
        res.send("Users table created");
        return;
    })
};
const InsertDataUsers = (req,res)=>{
    var Q_insert_users = "INSERT INTO Users SET ?";
    const csvFilePathUsers= path.join(__dirname, "csv/users.csv");
    csv()
    .fromFile(csvFilePathUsers)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewUser = {
            "email": element.email,
            "password": element.password,
            "address": element.address,
            "full_name": element.full_name,
        }
        SQL.query(Q_insert_users, NewUser, (err)=>{
            if (err) {
                console.log("error in inserting users data", err);
            }
            console.log("created user row successfully ");
        });
    });
    }); 
    res.send("users data inserted successfully");
};

const ShowUsers = (req,res)=>{
    var Q_show_users = "SELECT * FROM Users";
    SQL.query(Q_show_users, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing users table ", err);
            res.send("error in showing users table ");
            return;
        }
        console.log("showing users table");
        res.send(mySQLres);
        return;
    })};

const DropUsers = (req, res)=>{
    var Q_drop_users = "DROP TABLE Users";
    SQL.query(Q_drop_users, (err)=>{
        if (err) {
            console.log("error in dropping users table ", err);
            res.status(400).send({message: "error in dropping users table" + err});
            return;
        }
        console.log("users table dropped");
        res.send("users table dropped");
        return;
        })
    }
//categories
const CreateCategories = (req,res)=>{
    var Q_create_categories = "CREATE TABLE Categories (category VARCHAR(255),category_page VARCHAR(255), PRIMARY KEY (category) )";
    SQL.query(Q_create_categories,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating categories table"});
            return;
        }
        console.log('created categories table');
        res.send("categories table created");
        return;
    })
};

const InsertDataCategories = (req,res)=>{
    var Q_insert_categories = "INSERT INTO Categories SET ?";
    const csvFilePathCategories= path.join(__dirname, "csv/categories.csv");
    csv()
    .fromFile(csvFilePathCategories)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewCategory = {
            "category": element.category,
            "category_page": element.category_page
        }
        SQL.query(Q_insert_categories, NewCategory, (err)=>{
            if (err) {
                console.log("error in inserting categories data", err);
            }
            console.log("created category row successfully ");
        });
    });
    }); 
    res.send("categories data inserted successfully");
};

const ShowCategories = (req,res)=>{
    var Q_show_categories = "SELECT * FROM Categories";
    SQL.query(Q_show_categories, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing Categories table ", err);
            res.send("error in showing Categories table ");
            return;
        }
        console.log("showing Categories table");
        res.send(mySQLres);
        return;
    })};

const DropCategories = (req, res)=>{
    var Q_drop_categories = "DROP TABLE Categories";
    SQL.query(Q_drop_categories, (err)=>{
        if (err) {
            console.log("error in dropping Categories table ", err);
            res.status(400).send({message: "error in dropping Categories table" + err});
            return;
        }
        console.log("Categories table dropped");
        res.send("Categories table dropped");
        return;
        })
    }


//orders
const CreateOrders= (req,res)=>{
    var Q_create_orders = "CREATE TABLE Orders (order_ID SMALLINT, buyer_email VARCHAR(255),buyer_cellphone VARCHAR(255), credit_card_num VARCHAR(255), credit_card_exp DATE, credit_card_cvv SMALLINT, order_time DATETIME, FOREIGN KEY (buyer_email) REFERENCES Users(email), PRIMARY KEY (order_ID) )";
    SQL.query(Q_create_orders,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating orders table"});
            return;
        }
        console.log('created orders table');
        res.send("orders table created");
        return;
    })
};
const InsertDataOrders = (req,res)=>{
    var Q_insert_orders = "INSERT INTO Orders SET ?";
    const csvFilePathOrders= path.join(__dirname, "csv/orders.csv");
    csv()
    .fromFile(csvFilePathOrders)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewOrder = {
            "order_ID": element.order_ID,
            "buyer_email": element.buyer_email,
            "buyer_cellphone": element.buyer_cellphone,
            "credit_card_num": element.credit_card_num,
            "credit_card_exp": element.credit_card_exp,
            "credit_card_cvv": element.credit_card_cvv,
            "order_time": element.order_time
        }
        SQL.query(Q_insert_orders, NewOrder, (err)=>{
            if (err) {
                console.log("error in inserting orders data", err);
            }
            console.log("created order row successfully ");
        });
    });
    }); 
    res.send("orders data inserted successfully");
};
const ShowOrders = (req,res)=>{
    var Q_show_orders = "SELECT * FROM Orders";
    SQL.query(Q_show_orders, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing Orders table ", err);
            res.send("error in showing Orders table ");
            return;
        }
        console.log("showing Orders table");
        res.send(mySQLres);
        return;
    })};

const DropOrders = (req, res)=>{
    var Q_drop_orders = "DROP TABLE Orders";
    SQL.query(Q_drop_orders, (err)=>{
        if (err) {
            console.log("error in dropping Orders table ", err);
            res.status(400).send({message: "error in dropping Orders table" + err});
            return;
        }
        console.log("Orders table dropped");
        res.send("Orders table dropped");
        return;
        })
    }
//items
const CreateItems= (req,res)=>{
    var Q_create_items = "CREATE TABLE Items (serial_num SMALLINT,item_name VARCHAR(255), category VARCHAR(255), pickup_address VARCHAR(255), size VARCHAR(255), brand VARCHAR(255), manufacture_year SMALLINT, price SMALLINT, seller_email VARCHAR(255),sold BOOLEAN DEFAULT FALSE,buyer_email VARCHAR(255) DEFAULT NULL, order_ID SMALLINT DEFAULT NULL, FOREIGN KEY (category) REFERENCES Categories(category), FOREIGN KEY (seller_email) REFERENCES Users(email), FOREIGN KEY (buyer_email) REFERENCES Users(email), FOREIGN KEY (order_ID) REFERENCES Orders(order_ID), PRIMARY KEY (serial_num))";
    SQL.query(Q_create_items,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating items table"});
            return;
        }
        console.log('created items table');
        res.send("items table created");
        return;
    })
};
const InsertDataItems = (req,res)=>{
    var Q_insert_items = "INSERT INTO Items SET ?";
    const csvFilePathItems= path.join(__dirname, "csv/items.csv");
    csv()
    .fromFile(csvFilePathItems)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewItem = {
            "serial_num": element.serial_num,
            "item_name": element.item_name,
            "category": element.category,
            "pickup_address": element.pickup_address,
            "size": element.size,
            "brand": element.brand,
            "manufacture_year": element.manufacture_year,
            "price": element.price,
            "seller_email": element.seller_email,
            "sold": element.sold,
            "buyer_email":element.buyer_email,
            "order_ID": element.order_ID
            //"item_picture": element.item_picture
        }
        SQL.query(Q_insert_items, NewItem, (err)=>{
            if (err) {
                console.log("error in inserting items data", err);
            }
            console.log("created item row successfully ");
        });
    });
    }); 
    res.send("items data inserted successfully");
};
const ShowItems = (req,res)=>{
    var Q_show_items = "SELECT * FROM Items";
    SQL.query(Q_show_items, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing Items table ", err);
            res.send("error in showing Items table ");
            return;
        }
        console.log("showing Items table");
        res.send(mySQLres);
        return;
    })};

const DropItems = (req, res)=>{
    var Q_drop_items = "DROP TABLE Items";
    SQL.query(Q_drop_items, (err)=>{
        if (err) {
            console.log("error in dropping Items table ", err);
            res.status(400).send({message: "error in dropping Items table" + err});
            return;
        }
        console.log("Items table dropped");
        res.send("Items table dropped");
        return;
        })
    }

const DropTables= (req, res)=>{
    // DropItems(req, res);
    // DropOrders (req, res);
    //DropCategories (req, res);
    //DropUsers (req, res);
}

module.exports = {CreateUsers, InsertDataUsers,ShowUsers, CreateCategories, InsertDataCategories,ShowCategories,CreateOrders, InsertDataOrders,ShowOrders, CreateItems, InsertDataItems,ShowItems,DropTables };


//cart_query: select * from items where serial_num in (select serial_num from orders where buyer=this.buyer)