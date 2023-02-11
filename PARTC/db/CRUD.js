const SQL = require("./db");
const path = require("path");
const csv=require('csvtojson');

const create_user = (req,res)=>{
        // validate body exists
        if (!req.body) {
            res.status(400).send({message: "content cannot be empty"});
            return;
        }
        // insert input data from body into json
        const NewUser = {
            "email": req.body.sign_up_email,
            "password": req.body.sign_up_pass,
            "address": req.body.sign_up_address,
            "full_name": req.body.full_name,
        }
        // validate this is a new user
        const Q_validate_new_user = "SELECT * FROM Users WHERE email =?"
        SQL.query(Q_validate_new_user, NewUser.email, (err, results) =>{
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message:"Couldn't validate new user"});
                return;
            }if (results.length != 0){
                console.log("error: ", err);
                res.status(400).send({message:"There's already a user with this email address"});
                return;
            }
        })
        // inserting new user
        const Q_insert_user = 'INSERT INTO Users SET ?';
        SQL.query(Q_insert_user, NewUser, (err) =>{
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message:"Couldn't sign up new user"});
                return;
            }
            res.redirect('/homepage');
            return;
        })
} ;
const create_item = (req,res)=>{
    // validate body exists
    if (!req.body) {
        res.status(400).send({message: "content cannot be empty"});
        return;
    }
    // insert input data from body into json
    const NewItem = {
        "item_name": req.body.item_name,
        "category": req.body.category,
        "pickup_address": req.body.pickup_address,
        "size": req.body.size,
        "brand": req.body.brand,
        "manufacture_year": req.body.manufacture_year,
        "price": req.body.price,
        "seller_email": req.body.seller_email,
        "sold": req.body.sold,
        "buyer_email":req.body.buyer_email,
        "order_ID": req.body.order_ID,
        "item_picture": req.body.item_picture
    }
    // create a new serial number
    const Q_get_max_serial = "SELECT MAX(serial_num) as max_num FROM Items"
    SQL.query(Q_get_max_serial, (err, results) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message:"Couldn't get max serial number"});
            return;
        }
        if(results.isInteger()){
            NewItem["serial_num"]=results[0].max_num+1;
            return;
        }
        else{ 
            res.status(400).send({message:"Invalid max serial number"});
            return;
        }
    })
    // inserting new item
    const Q_insert_item = 'INSERT INTO Items SET ?';
    SQL.query(Q_insert_item, NewItem, (err) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message:"Couldn't add new item"});
            return;
        }
        res.redirect('/main_page');
        return;
    })
} ;

const sign_in = (req,res)=>{
        // validate body exists
        if (!req.body) {
            res.status(400).send({message: "content cannot be empty"});
            return;
        }
        // insert input data from body 
        const user = [req.body.sign_in_email, req.body.sign_in_password]
        // check the user exists and sign in
        const Q_check_user = "SELECT * FROM Users WHERE email=? and password=?"
        SQL.query(Q_check_user, user, (err, results) =>{
            if (err) {
                console.log("error:", err);
                res.status(400).send({message:"error finding user"});
                return;
            }
            if (results.length == 0){
                console.log("error:", err);
                res.status(400).send({message:"Invalid email or password"});
                return;
            }
            res.cookie("user_email", results[1].email);
            res.redirect('/main_page');
            return;
        })
         
} ;

const reset_pass= (req,res)=>{
    // validate body exists
    if (!req.body) {
        res.status(400).send({message: "content cannot be empty"});
        return;
    }
    // insert input data from body 
    const email = req.body.email_forgot_pass
    // get the user's password
    const Q_get_pass = "SELECT password FROM Users WHERE email=?"
    SQL.query(Q_get_pass, email, (err, results) =>{
        if (err) {
            console.log("error:", err);
            res.status(400).send({message:"error finding user's password"});
            return;
        }
        if (results.length == 0){
            console.log("error:", err);
            res.status(400).send({message:"Invalid email"});
            return;
        }
        else{
            //send email
        }
        res.redirect('/homepage');
        return;
    })
     
} ;
const get_categories = (req,res)=>{
    var Q_get_categories_len = "SELECT count(*) as len FROM Categories";
    var Q_get_top_half="SELECT * FROM Categories ORDER BY category LIMIT ?";
    var Q_get_bottom_half="SELECT * FROM (SELECT * FROM Categories ORDER BY category DESC) as c LIMIT ?";
    SQL.query(Q_get_categories_len, (err, cats_len)=>{
        if (err) {
            console.log("error in getting Categories length", err);
            res.send("error in getting Categories length");
            return;
        }
        console.log("got length", cats_len[0].len);
        SQL.query(Q_get_top_half,cats_len[0].len/2, (err, top_half)=>{
            if (err) {
                console.log("error in getting Categories", err);
                res.send("error in getting Categories");
                return;
            }
            console.log("got top");
            SQL.query(Q_get_bottom_half,cats_len[0].len/2, (err, bottom_half)=>{
                if (err) {
                    console.log("error in getting Categories", err);
                    res.send("error in getting Categories");
                    return;
                }
                console.log("got bottom");
                res.render('categories', {top_categories: top_half, bottom_categories:bottom_half});
                return;
            })}
        )}
    )};

// const get_categories = (req,res)=>{
//     // run quries
//     const Q_get_categories = "SELECT * FROM Classes WHERE building=? and date=? and start<=? and end>=?"
//     SQL.query(Q4, data, (err, results) =>{
//         if (err) {
//             console.log("error: error: ", err);
//             res.status(400).send({message:"בעיה במציאת כיתוב"});
//             return;
//         }
//         if (results.length == 0){
//             console.log("error: error: ", err);
//             res.status(400).send({message:"אין כיתות פנויות"});
//             return;
//         }
//         res.cookie("ClasessAvailable", results);
//         res.redirect('/ResultsPage');
//         return;
//     })
     
// } ;

module.exports = {create_user,create_item,sign_in,reset_pass,get_categories}