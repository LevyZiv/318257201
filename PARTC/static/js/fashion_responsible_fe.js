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
  const checkout_form= document.querySelector("#checkout_form");
  const onSubmit_checkout =() =>{
      window.alert("Thank you for shopping with Fashion Responsible! An email was sent to the seller and they will contact you soon. you're being directed to continue shopping :)");
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
function closeItem(item_ID){
  var popup = document.getElementById(item_ID);
  popup.style.visibility= "hidden";
}

function pop_out_item(item_ID){
  const popup = document.getElementById(item_ID)
    if (popup.style.visibility!="visible"){
      popup.style.visibility= "visible";
    }
    else{ closeItem(item_ID)}
}

//cart & checkout functions

function add_to_cart(item_ID){
  const data = {
    item_ID: item_ID
  };

  fetch('/add_item_to_cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  closeItem(item_ID);

}

function add_to_order() {
  let checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
  let itemIds = Array.from(checkedBoxes).map(function(checkbox) {
    return parseInt(checkbox.id, 10);
  });
  const data = {
    ids_list: itemIds
  };

  fetch('/add_items_to_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  location.reload();
}

function remove_from_cart() {
  let checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
  let itemIds = Array.from(checkedBoxes).map(function(checkbox) {
    return parseInt(checkbox.id, 10);
  });
  const data = {
    ids_list: itemIds
  };
  fetch('/remove_items_from_cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  location.reload();

  
}
