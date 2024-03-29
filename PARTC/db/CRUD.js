const SQL = require("./db");
const path = require("path");
const csv=require('csvtojson');
const nodemailer = require("nodemailer");


async function send_email(email_to_send, title, content){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "fashionresponsible2023@gmail.com",
            pass: "eaghcdrchcvdnmkr"
        }
    });
    let mail={
        from: "fashionresponsible2023@gmail.com",
        to: email_to_send,
        subject: title,
        text: content
    }
    let info= await transporter.sendMail(mail);
    console.log("sent email ", info.response);
}

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
    var max_index=-1;
    if (!req.body) {
        res.status(400).send({message: "content cannot be empty"});
        return;
    }
    console.log("file title is ",req.file.filename);
    // create a new serial number
    const Q_get_max_serial = "SELECT MAX(serial_num) as max_num FROM Items";
    SQL.query(Q_get_max_serial, (err, results) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message:"Couldn't get max serial number"});
            return;
        }
        if(Number.isInteger(results[0].max_num)){
            max_index=results[0].max_num+1;
               // insert input data from body into json
            const NewItem = {
                "serial_num": max_index,
                "item_name": req.body.add_item_name,
                "category": req.body.add_item_category,
                "pickup_address": req.body.add_item_address,
                "size": req.body.add_item_size,
                "brand": req.body.add_item_brand,
                "manufacture_year": req.body.add_item_year,
                "price": req.body.add_item_price,
                "seller_email": req.cookies.user_email,
                "sold": 0,
                "buyer_email": null,
                "order_ID": null,
                "item_picture": '/images/' +req.file.filename
            }
                // inserting new item
            const Q_insert_item = 'INSERT INTO Items SET ?';
            SQL.query(Q_insert_item, NewItem, (err) =>{
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message:"Couldn't add new item", NewItem});
                    return;
                }
                console.log("insereted item successfully");
                res.cookie("user_email", req.cookies.user_email);
                res.redirect('/main_page');
                return;
            })
        }
        else{ 
            res.status(400).send({message:"Invalid max serial number"});
            return;
        }
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
            res.cookie("user_email", results[0].email);
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
            const subject= "Your password for Fashion Responsible";
            const content= "Your password is: "+results[0].password;
            send_email(email, subject, content);
            console.log("sent assword to user ", email, results[0].password);
        }
        res.redirect('/homepage');
        return;
    })
     
} ;
const get_categories = (req,res)=>{
    res.cookie("user_email", req.cookies.user_email);
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
    const get_all_categories = (req,res)=>{
        res.cookie("user_email", req.cookies.user_email);
        var Q_get_categories = "SELECT category FROM Categories";
        SQL.query(Q_get_categories, (err, cats)=>{
            if (err) {
                console.log("error in getting all Categories", err);
                res.send("error in getting all Categories");
                return;
            }
            console.log("got categories");
            res.render('add_item', {categories: cats});
            return;
            
    })};

    const get_category_items = (req,res)=>{
        const category_page=req.url;
        var Q_get_category_name="SELECT * FROM Categories WHERE category_page LIKE CONCAT('%', ?, '%')";
        SQL.query(Q_get_category_name,category_page, (err, results) =>{
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message:"Couldn't get category name"});
                return;
            }
            const category=results[0].category;
            var Q_get_items = "SELECT * FROM Items WHERE category=? AND sold=0";
            SQL.query(Q_get_items,category, (err, items)=>{
                if (err) {
                    console.log("error in getting category items", err);
                    res.send("error in getting category items");
                    return;
                }
                res.cookie("user_email", req.cookies.user_email);
                res.render(category_page.substring(1), {category_items: items});
                return;
    })})};

    const add_item_to_cart = (req,res)=>{
        const user= req.cookies.user_email;
        const item_ID= req.body.item_ID;
        var Q_update_buyer_email="UPDATE Items SET buyer_email = ? WHERE serial_num = ?";
        SQL.query(Q_update_buyer_email, [user, item_ID], (err, results)=>{
            if (err) {
                console.log("error in adding to cart- updating item email", err);
                res.send("error in adding to cart- updating item email");
                return;
            }
            console.log("added buyer to item ", user, item_ID);
            res.cookie("user_email", req.cookies.user_email);
            return;
        }
    )};
    const get_cart_items = (req,res)=>{
        const user=req.cookies.user_email;
        var Q_get_cart_items="SELECT * FROM Items WHERE buyer_email=? AND sold=0";
        SQL.query(Q_get_cart_items,user, (err, results) =>{
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message:"Couldn't get cart items"});
                return;
            }
            let total = 0;
            for (let i = 0; i < results.length; i++) {
                total += results[i].price;
            }
            res.cookie("user_email", req.cookies.user_email);
            res.render("cart", {cart_items: results, total_price:total, user: user});
            return;
    })};

    const create_order = (user, callback) => {
        //get current max order id
        const Q_get_max_order = "SELECT MAX(order_ID) as max_order FROM Orders";
        SQL.query(Q_get_max_order, (err, results) => {
            if (err) {
                console.log("error: ", err);
                res.status(400).send({ message: "Couldn't get max order ID" });
                return;
            }
            if (Number.isInteger(results[0].max_order)) {
                max_index = results[0].max_order + 1;
                // insert input data from body into json
                var NewOrder = {
                    "order_ID": max_index,
                    "buyer_email": user,
                    "buyer_cellphone": null,
                    "credit_card_num": null,
                    "credit_card_exp": null,
                    "credit_card_cvv": null,
                    "order_date": null
                };
                // inserting new order
                const Q_insert_order = "INSERT INTO Orders SET ?";
                SQL.query(Q_insert_order, NewOrder, (err) => {
                    if (err) {
                        console.log("error: ", err);
                        return;
                    }
                    console.log("insereted order successfully");
                    callback(max_index);
                });
            }
        });
    };
    
    const add_items_to_order = (req, res) => {
        const user = req.cookies.user_email;
        const item_IDs = req.body.ids_list;
        create_order(user, (order_id) => {
            const Q_update_items_orders = "UPDATE Items SET order_ID = ? WHERE serial_num IN (?)";
            SQL.query(Q_update_items_orders, [order_id, item_IDs], (err) => {
                if (err) {
                    console.log("error in adding to order- updating item order id", err);
                    res.send("error in adding to order- updating item order id");
                    return;
                }
                console.log("added order to item ", order_id, item_IDs);
                res.cookie("user_email", req.cookies.user_email);
                return;
            });
        });
    };

    const remove_items_from_cart = (req, res) => {
        const item_IDs = req.body.ids_list;
        const Q_update_items_buyers = "UPDATE Items SET buyer_email = NULL WHERE serial_num IN (?)";
        SQL.query(Q_update_items_buyers, [item_IDs], (err) => {
            if (err) {
                console.log("error in removing from cart- updating item buyer email", err);
                res.send("error in removing from cart- updating item buyer email");
                return;
            }
            //check if the items were added to order
            const Q_check_items_in_order= "SELECT order_ID FROM Items WHERE serial_num IN (?)"
            SQL.query(Q_check_items_in_order, [item_IDs], (err, orders_IDs) => {
                if (err) {
                    console.log("error in removing from cart- getting orders with removed items", err);
                    res.send("error in removing from cart- getting orders with removed items");
                    return;
                }
                //remove items from orders
                const Q_remove_items_from_orders="UPDATE Items SET order_ID = NULL WHERE serial_num IN (?)";
                SQL.query(Q_remove_items_from_orders, [item_IDs], (err) => {
                    if (err) {
                        console.log("error in removing from cart- updating item order ID", err);
                        res.send("error in removing from cart- updating item order ID");
                        return;
                    }
                    //check if the order contains more items- if not, delete it
                    const Q_get_items_from_orders="SELECT count(serial_num) as items_num FROM Items WHERE order_ID=?";
                    let count1 = 0;
                    let count2 = 0;
                    for (let i = 0; i < orders_IDs.length; i++) {
                        SQL.query(Q_get_items_from_orders,orders_IDs[i].order_ID,  (err, items_in_orders) => {
                            if (err) {
                                console.log("error in removing from cart- getting other items in orders", err);
                                res.send("error in removing from cart- getting other items in orders");
                                return;
                            }
                            if (items_in_orders[0].items_num==0){
                                const Q_delete_regretted_orders="DELETE FROM Orders WHERE  order_ID=?";
                                SQL.query(Q_delete_regretted_orders,orders_IDs[i].order_ID,  (err) => {
                                    if (err) {
                                        console.log("error in removing from cart- getting other items in orders", err);
                                        res.send("error in removing from cart- getting other items in orders");
                                        return;
                                    }
                                })
                                count1+=1;
                            }
                            else{ count2+=1;}

                        })
                    }
                    //to make the func wait until all the queries are done
                    if (count1+count2==orders_IDs.length-1){
                        console.log("removed items from cart ", item_IDs);
                        res.cookie("user_email", req.cookies.user_email);
                        return;
                    }

            })})
        });
        
    };
    const checkout= (req, res) => {
        const user = req.cookies.user_email;
        const Q_get_orders_prices="SELECT price FROM Items WHERE order_ID IN (SELECT order_ID FROM Orders WHERE buyer_email=? AND order_date IS NULL)";
        SQL.query(Q_get_orders_prices, user, (err, user_orders_prices) => {
            if (err) {
                console.log("error in getting user's orders", err);
                res.send("error in getting user's orders");
                return;
            }
            let total = 0;
            for (let i = 0; i < user_orders_prices.length; i++) {
                total += user_orders_prices[i].price;
            }
            res.cookie("user_email", req.cookies.user_email);
            res.render("checkout", {total_price:total});
            return;
        })
    }

    const checkout_pay= (req, res) => {
        const user = req.cookies.user_email;
        // getting all the orders the user has and merging into a new one (user can add to orders a few times without checkout)
        const Q_get_user_orders="SELECT order_ID FROM Orders WHERE buyer_email=? AND order_date IS NULL";
        SQL.query(Q_get_user_orders, user, (err, user_orders) => {
            if (err) {
                console.log("error in getting user's orders", err);
                res.send("error in getting user's orders");
                return;
            }
            //creating new order and saving it to items
            create_order(user, (order_id) => {
                let orderIds = user_orders.map(order => order.order_ID).join("','");
                orderIds = `'${orderIds}'`;
                const Q_update_items_orders = "UPDATE Items SET order_ID = ? , sold=1 WHERE order_ID IN (" + orderIds + ")";
                SQL.query(Q_update_items_orders, [order_id, user_orders], (err) => {
                    if (err) {
                        console.log("error in updating item order id", err);
                        res.send("error in updating item order id");
                        return;
                    }
                    console.log("updated items orders");
                    //deleting all the old orders
                    const Q_delete_old_orders="DELETE FROM Orders WHERE  order_ID IN (" + orderIds + ")";
                    SQL.query(Q_delete_old_orders, (err) => {
                        if (err) {
                            console.log("error in deleting old orders", err);
                            res.send("error in deleting old orders");
                            return;
                        }
                        console.log("deleted old orders");
                        //updating the new order from the form details
                        const orderDetails={
                        "buyer_cellphone": req.body.phone_number,
                        "credit_card_num": req.body.credit_card_num,
                        "credit_card_exp": req.body.credit_card_date,
                        "credit_card_cvv": req.body.credit_card_sec,
                        "order_date": new Date().toISOString().slice(0, 10)
                        }
                        const Q_update_order="UPDATE Orders SET ? WHERE order_ID=?";
                        SQL.query(Q_update_order, [orderDetails,order_id ], (err) => {
                            if (err) {
                                console.log("error in deleting old orders", err);
                                res.send("error in deleting old orders");
                                return;
                            }
                            // getting all the item's names and sellers' emails for the order
                            const Q_get_order_items= "SELECT item_name, seller_email, buyer_email FROM Items WHERE order_ID=? ";
                            SQL.query(Q_get_order_items, order_id, (err, items_details) => {
                                if (err) {
                                    console.log("error in getting order's items", err);
                                    res.send("error in getting order's items");
                                    return;
                                }
                                for (let i = 0; i < items_details.length; i++) {
                                    const email_subject= "Your item in Fashion Responsible is sold!";
                                    const email_content= "Your item "+items_details[i].item_name+" was sold! please contact the buyer in email: "+items_details[i].buyer_email;
                                    send_email(items_details[i].seller_email, email_subject, email_content);
                                }
                                console.log("successfullt created new order",orderDetails,order_id );
                                res.cookie("user_email", req.cookies.user_email);
                                res.redirect("/main_page");
                            })
                        })
                });
            });

        })
    })
    };
    

module.exports = {create_user,create_item,sign_in,reset_pass,get_categories,get_all_categories,get_category_items,add_item_to_cart,get_cart_items,add_items_to_order,remove_items_from_cart,checkout,checkout_pay}