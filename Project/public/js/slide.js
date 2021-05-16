var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n, true);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n, true);
}

function showSlides(n, check=false) {
  var i;
  var slides = document.getElementsByClassName("slides");
  var dots = document.getElementsByClassName("dot");
  // scroll back to first index
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
    //block all slides from showing
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  // show slide at index -1
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";

  // auto slide
  if (check == false){
    setTimeout(function(){showSlides(slideIndex += 1)}, 10000)
  }
}

function Button(){
    var xml = new XMLHttpRequest();
    let text = {city:null, state:null};
    let city = document.getElementById('city').value;
    let state = document.getElementById('state').value;
    text.city = city
    text.state = state
    xml.open('POST', 'http://127.0.0.1:5000/citydata', true);
    xml.setRequestHeader('Content-Type', 'application/json');
    xml.addEventListener('load', function(){
        if(xml.status >= 200 && xml.status < 400){
          var response = JSON.parse(xml.responseText);
          var table = document.getElementById('info');
          var div = document.createElement('div');
          var ul = document.createElement('ul');
          var h = document.createElement('H2');
          
          div.setAttribute('class','card');
   
          if (typeof response != 'string'){
            var t = document.createTextNode(city + ', ' + state);
            Object.keys(response).forEach(function(key) {
              if (response[key] != null && key != 'City'){
                var li = document.createElement('li');
                li.textContent = key + ": " + response[key]
                ul.appendChild(li);
              }
            });
          }
          else{
            var t = document.createTextNode(response);
          }
          h.appendChild(t)
          div.appendChild(h)
          div.appendChild(ul);
          table.insertBefore(div, table.firstChild)



        } 
        else {
          document.getElementById('data').textContent = "Error in network request: ";
        }
    });
    xml.send(JSON.stringify(text));
    event.preventDefault();
}
