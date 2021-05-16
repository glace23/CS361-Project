// add highlight to menu
if(location.pathname=="/") { document.getElementById("home").classList.add("active");};
if(location.pathname=="/aboutme") { document.getElementById("about").classList.add("active");};
if(location.pathname=="/contact") { document.getElementById("contact").classList.add("active");};
if(location.pathname=="/blog") { document.getElementById("blog").classList.add("active");};

function removehighlight(){
  document.getElementById("home").classList.remove("active")
  document.getElementById("about").classList.remove("active")
  document.getElementById("contact").classList.remove("active")
  document.getElementById("something").classList.remove("active")

}

document.getElementById("home").addEventListener("click", function(){
  removehighlight();
  document.getElementById("home").classList.add("active");
});
document.getElementById("about").addEventListener("click", function(){
  removehighlight();
  document.getElementById("about").classList.add("active");
});
document.getElementById("contact").addEventListener("click", function(){
  removehighlight();
  document.getElementById("contact").classList.add("active");
});
document.getElementById("something").addEventListener("click", function(){
  removehighlight();
  document.getElementById("something").classList.add("active");
});
document.getElementById("banner").addEventListener("click", function(){
  removehighlight();
  document.getElementById("home").classList.add("active");
});