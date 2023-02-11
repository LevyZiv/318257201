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
const cookieParser = require('cookie-parser')

app.use(express.static(path.join(__dirname,'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
    res.render('homepage');
});
app.get("/main_page", (req, res) => {
    res.render('main_page');
});
app.get("/forgot_password", (req, res) => {
    res.render('forgot_password');
});
app.get("/sign_up", (req, res) => {
    res.render('sign_up');
});
app.get("/categories", CRUD.get_categories ); //{
    // SQL.query("SELECT * FROM Categories", (err, cats)=>{
    //     if (err) {
    //         console.log("error in showing Categories table ", err);
    //         res.send("error in showing Categories table ");
    //         return;
    //     }
    //     else{
    //         res.render('categories', {categories: cats});
    //     }
    // })    
//});

//all post actions
app.post('/sign_in',CRUD.sign_in);
app.post('/reset_pass',CRUD.reset_pass);
app.post('/create_user',CRUD.create_user);

    // set port, listen for requests
app.listen(port, () => {
    console.log("Server is running on port 3000.");
});


