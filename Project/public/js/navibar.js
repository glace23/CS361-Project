if(location.pathname=="/") { 
  document.getElementById("home").classList.add("w3-text-white");
  document.getElementById("home").classList.add("w3-teal");
};
if(location.pathname=="/calc") { 
  document.getElementById("calculator").classList.add("w3-text-white");
  document.getElementById("calculator").classList.add("w3-teal");
};

function clearHighlight(){
  document.getElementById("home").classList.remove("w3-text-teal");
  document.getElementById("calculator").classList.remove("w3-text-teal");
}

document.getElementById("home").addEventListener("click", function(){
  clearHighlight();
  document.getElementById("home").classList.add("w3-text-teal");
});
document.getElementById("calculator").addEventListener("click", function(){
  clearHighlight();
  document.getElementById("calculator").classList.add("w3-text-teal");
});
