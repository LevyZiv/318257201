// setting the side bar popping out

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("side_nav_bar").style.width = "20rem";
  document.getElementById("main").style.marginRight = "20rem";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("side_nav_bar").style.width = "0";
  document.getElementById("main").style.marginRight = "0";
}