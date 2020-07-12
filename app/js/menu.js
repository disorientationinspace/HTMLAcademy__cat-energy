var header = document.querySelector(".main-header");
var open = document.querySelector(".main-header__open");
var close = document.querySelector(".main-header__close");


header.classList.remove("main-header--no-js");

open.addEventListener("click", function() {
  header.classList.add("main-header--active");
})

close.addEventListener("click", function() {
  header.classList.remove("main-header--active");
})
