var currentPage = window.location.pathname
    , sign_up="sign_up"
    , checkout="checkout"
    , home="homepage"
    , categories= "categories"
    , add_item="add_item";
const sign_up_pass = document.querySelector("#sign_up_pass")
    , confirm_password = document.querySelector("#su_confirm_password")
      , sign_up_address=document.querySelector("#sign_up_address")
      , sign_up_form=document.querySelector('#sign_up_form');

//data validation

//functions
function validatePassword(pass1,pass2){
  if(pass1.value != pass2.value) {
    window.alert("Passwords Don't Match!");
    return false;
  }
  return true;
}

function validateAddressIsrael(address){
  if(address.value.toLowerCase().indexOf("israel")==-1){
    window.alert("Address not in israel");
    return false;
  }
  return true;
}

//sign up validation- confirmed password & israel address

if(currentPage.includes(sign_up)){
  const onSubmit_sign_up =(e)=>{
    if(!(validatePassword(sign_up_pass, confirm_password) && validateAddressIsrael(sign_up_address))){
      e.preventDefault();
    }
  }
    sign_up_form.addEventListener('submit',onSubmit_sign_up);
}
// checkout validation- confirm israel address
if(currentPage.includes(checkout)){
  const checkout_form= document.querySelector("#checkout_form")
    , address_conf=document.querySelector("#address_conf");
  const onSubmit_checkout =(d)=>{
    d.preventDefault();
    if(validateAddressIsrael(address_conf)){
      window.alert("Thank you for shopping with Fashion Responsible! you're being directed to continue shopping :)")
      
    }
  }
  checkout_form.addEventListener('submit',onSubmit_checkout);
}

// setting the side bar popping out

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.querySelector('#side_nav_bar').style.width = "20rem";
  document.querySelector('#main').style.marginRight = "20rem";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.querySelector('#side_nav_bar').style.width = "0";
  document.querySelector('#main').style.marginRight = "0";
}

//creating pop out function for items in categories
function closeItem(id_pop){
  var popup = document.getElementById(id_pop);
  popup.style.visibility= "hidden";
}

function pop_out_item(id_pop){
  const popup = document.getElementById(id_pop)
    if (popup.style.visibility!="visible"){
      popup.style.visibility= "visible";
    }
    else{ closeItem(id_pop)}
}


function add_to_cart(id_pop){
  //this will add item to cart in partC
}