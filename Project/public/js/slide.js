var counter = 0

function checkDC(event){
  if(event.target.value == 'DC'){
    document.getElementById("city").setAttribute('value', 'Washington')
    document.getElementById("city").disabled = true;
  }
  else{
    document.getElementById("city").setAttribute('value', '')
    document.getElementById("city").disabled = false;
  }
}

function addCity(){
  document.getElementById("add").disabled = true;
  document.getElementById("add").setAttribute('value', 'Sending Data...')
  var t0 = performance.now()
  Button()
  var t1 = performance.now()
  setTimeout(function(){
    document.getElementById("add").disabled = false;
    document.getElementById("add").setAttribute('value', 'Add')
  }, (t1-t0)*1000);
}


function Button(){
    var xml = new XMLHttpRequest();
    let text = {city:null, state:null};
    let city = document.getElementById('city').value;
    let state = document.getElementById('state').value;
    let language = document.getElementById('language').value;
    if(state == 'DC'){
      city = 'Washington'
    }
    text.city = city
    text.state = state
    counter = counter + 1
    xml.open('POST', 'http://127.0.0.1:5000/citydata', true);
    xml.setRequestHeader('Content-Type', 'application/json');
    xml.addEventListener('load', function(){
        if(xml.status >= 200 && xml.status <= 400){
          var response = JSON.parse(xml.responseText);
          var table = document.getElementById('info');
          var div = document.createElement('div');
          var ul = document.createElement('ul');
          var h = document.createElement('H2');
          div.setAttribute('class','card');
          div.setAttribute('id', counter);

          var deleteButton = document.createElement('input');
          deleteButton.setAttribute('value', 'Delete');
          deleteButton.setAttribute('onclick', 'Delete(' + counter + ')')
          deleteButton.setAttribute('type', 'button')


          if (typeof response != 'string'){
            var t = document.createTextNode(city.toUpperCase() + ', ' + state);
            Object.keys(response).forEach(function(key) {
              if (response[key] != null && key != 'City'){
                var li = document.createElement('li');
                li.textContent = key + ": " + response[key]
                let translated = Language(language, li.textContent)
                li.textContent = translated
                ul.appendChild(li);
              }
            });
          }
          // else{
          //   var t = document.createTextNode(response);
          // }
          h.appendChild(t)
          div.appendChild(h)
          div.appendChild(ul)
          div.appendChild(deleteButton)
          table.insertBefore(div, table.firstChild)


        } 
        else {
          var response = JSON.parse(xml.responseText);
          var table = document.getElementById('info');
          var div = document.createElement('div');
          var ul = document.createElement('ul');
          var h = document.createElement('H2');
          div.setAttribute('class','card');
          div.setAttribute('id', counter);

          var deleteButton = document.createElement('input');
          deleteButton.setAttribute('value', 'Delete');
          deleteButton.setAttribute('onclick', 'Delete(' + counter + ')')
          deleteButton.setAttribute('type', 'button')

          let translated = Language(language, response)
          var t = document.createTextNode(translated);

          h.appendChild(t)
          div.appendChild(h)
          div.appendChild(ul);
          div.appendChild(deleteButton)
          table.insertBefore(div, table.firstChild)

        }
    });
    xml.send(JSON.stringify(text));
    event.preventDefault();
}




function Language(language, text){
  if (language == 'English'){
    return text
  } 
  var xml = new XMLHttpRequest();
  let textTrans = {"Text":text, "Language":language};
  let translated = "text"
  xml.open('POST', 'http://flip3.engr.oregonstate.edu:1524/language', false);
  xml.setRequestHeader('Content-Type', 'application/json');
  xml.addEventListener('load', function(){
    if(xml.status >= 200 && xml.status < 400){
      var response = JSON.parse(xml.responseText);
      return translated = response.output
    }
  });
  xml.send(JSON.stringify(textTrans));
  return translated
}

function Delete(el){
  var element = document.getElementById(el);
  element.parentNode.removeChild(element);
}