const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const SQL = require('./db/db');
const CRUD = require('./db/CRUD');
const createDB = require('./db/createDB');
const port = 3000;
const fs = require('fs');
const stringify = require('csv-stringify').stringify;
const { parse } = require("csv-parse");
const CSVToJSON = require('csvtojson');
const cookieParser = require('cookie-parser');
var multer  = require('multer')

app.use(express.static(path.join(__dirname,'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'static/item_images/')));

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//multer object creation
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/item_images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })
 
app.get('/CreateUsers',createDB.CreateUsers);
app.get('/InsertDataUsers',createDB.InsertDataUsers);
app.get('/ShowUsers',createDB.ShowUsers);
app.get('/CreateCategories',createDB.CreateCategories);
app.get('/InsertDataCategories',createDB.InsertDataCategories);
app.get('/ShowCategories',createDB.ShowCategories);
app.get('/CreateOrders',createDB.CreateOrders);
app.get('/InsertDataOrders',createDB.InsertDataOrders);
app.get('/ShowOrders',createDB.ShowOrders);
app.get('/CreateItems',createDB.CreateItems);
app.get('/InsertDataItems',createDB.InsertDataItems);
app.get('/ShowItems',createDB.ShowItems);
app.get('/DropTables',createDB.DropTables);


//all routings

app.get("/", (req, res) => {
    res.redirect("/homepage");
});

app.get("/homepage", (req, res) => {
    res.clearCookie("user_email");
    res.render('homepage');
});
app.get("/main_page", (req, res) => {
    res.cookie("user_email", req.cookies.user_email);
    res.render('main_page');
});
app.get("/forgot_password", (req, res) => {
    res.render('forgot_password');
});
app.get("/sign_up", (req, res) => {
    res.render('sign_up');
});

app.get("/checkout",CRUD.checkout);

app.get("/categories", CRUD.get_categories);

app.get("/add_item", CRUD.get_all_categories );

app.get("/cart", CRUD.get_cart_items);

//category pages
app.get("/men_accessories", CRUD.get_category_items);
app.get("/men_pants", CRUD.get_category_items);
app.get("/men_shirts", CRUD.get_category_items);
app.get("/men_shoes", CRUD.get_category_items);
app.get("/women_accessories", CRUD.get_category_items);
app.get("/women_pants", CRUD.get_category_items);
app.get("/women_shirts", CRUD.get_category_items);
app.get("/women_shoes", CRUD.get_category_items);


//all post actions
app.post('/sign_in',CRUD.sign_in);
app.post('/reset_pass',CRUD.reset_pass);
app.post('/create_user',CRUD.create_user);
app.post('/create_item',upload.single('imageupload'),CRUD.create_item);
app.post('/add_item_to_cart',CRUD.add_item_to_cart);
app.post('/add_items_to_order',CRUD.add_items_to_order);
app.post('/remove_items_from_cart',CRUD.remove_items_from_cart);
app.post('/checkout_pay',CRUD.checkout_pay);

// set port, listen for requests
app.listen(port, () => {
    console.log("Server is running on port ", port);
});


