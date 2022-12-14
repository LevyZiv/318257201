var currentPage = window.location.pathname
    , sign_up="sign_up.html"
    , checkout="checkout.html"
    , home="homepage.html"
    , add_item="add_item.html"
    , forgot_pass="forgot_password.html";

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
  const sign_up_pass = document.querySelector("#sign_up_pass")
  , confirm_password = document.querySelector("#su_confirm_password")
    , sign_up_address=document.querySelector("#sign_up_address")
    , sign_up_form=document.querySelector('#sign_up_form');
  const onSubmit_sign_up =(e)=>{
    e.preventDefault();
    if(validatePassword(sign_up_pass, confirm_password) && validateAddressIsrael(sign_up_address)){
      window.location.href = "../views/homepage.html";
    }
    sign_up_form.addEventListener('submit',onSubmit_sign_up);
  }
}
// checkout validation- confirm israel address
if(currentPage.includes(checkout)){
  const checkout_form= document.querySelector("#checkout_form")
    , address_conf=document.querySelector("#address_conf");
  const onSubmit_checkout =(d)=>{
    d.preventDefault();
    if(validateAddressIsrael(address_conf)){
      window.alert("Thank you for shopping with Fashion Responsible! you're being directed to continue shopping :)")
      window.location.href = "../views/categories.html";
    }
  }
  checkout_form.addEventListener('submit',onSubmit_checkout);
}




// redirecting to another page from submit (when validation is done in html)
if(currentPage.includes(home)){
  const home_form= document.querySelector("#home_form");
   const onSubmit_home =(e)=>{
     e.preventDefault();
     window.location.href = "../views/categories.html";
   }
   home_form.addEventListener('submit', onSubmit_home);
}
if(currentPage.includes(add_item)){
  const add_item_form= document.querySelector("#add_item_form");
   const onSubmit_add_item =(e)=>{
     e.preventDefault();
     window.location.href = "../views/categories.html";
   }
   add_item_form.addEventListener('submit', onSubmit_add_item);
}
if(currentPage.includes(forgot_pass)){
  const forgot_pass_form= document.querySelector("#forgot_pass_form");
   const onSubmit_forgot_pass =(e)=>{
     e.preventDefault();
     window.location.href = "../views/homepage.html";
   }
   forgot_pass_form.addEventListener('submit', onSubmit_forgot_pass);
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