// keeps track of element ID
var IdCounter = 0

function checkDC(event){
  /* 
    Checks if the user selects the state as DC 
  */
  if(event.target.value == 'DC'){
    // if user selects state as DC, set city value as Washington and disable manual input
    document.getElementById("city").setAttribute('value', 'Washington')
    document.getElementById("city").disabled = true;
  }
  else{
    // if user selects other states, remove city value
    document.getElementById("city").removeAttribute('value');
    document.getElementById("city").disabled = false;
  }
}

function addCity(){
  /*
    Enables and disables add button when user sends getTaxRateFromCity request
  */

  // disable and change add button to send data when user sends request
  document.getElementById("add").disabled = true;
  document.getElementById("add").setAttribute('value', 'Sending Data...')

  // find time interval for to process request
  var t0 = performance.now()
  getInfoFromCity()
  var t1 = performance.now()

  // sets time for add button to functioning again
  setTimeout(function(){
    document.getElementById("add").disabled = false;
    document.getElementById("add").setAttribute('value', 'Add')
  }, (t1-t0)*1000);
}


function getInfoFromCity(){
  /*
    Gets city info from microservice and show on to webpage
  */

  // set up post request
  var xml = new XMLHttpRequest();
  let text = {city:null, state:null};
  let city = document.getElementById('city').value;
  let state = document.getElementById('state').value;
  let language = document.getElementById('language').value;
  // default value for city when state is DC
  if(state == 'DC') {city = 'Washington'};
  text.city = city
  text.state = state
  IdCounter = IdCounter + 1
  xml.open('POST', 'http://127.0.0.1:5000/citydata', true);
  xml.setRequestHeader('Content-Type', 'application/json');
  xml.addEventListener('load', function(){
    //Sucessful
    if(xml.status >= 200 && xml.status <= 400){
      var response = JSON.parse(xml.responseText);
      createCard(response, language, city, state)
    } 
    //Failed
    else {
      var response = JSON.parse(xml.responseText);
      createCard(response, language)
    }
  });
  xml.send(JSON.stringify(text));
  event.preventDefault();
}

function createCard(response, language='English', city='', state=''){
  /*
    Creates corresponding city card DOM object on webpage
  */

  //Initalize city card elements
  var table = document.getElementById('info');
  var ul = document.createElement('ul');
  var h = document.createElement('H2');

  var div = document.createElement('div');
  div.setAttribute('class','card');
  div.setAttribute('id', IdCounter);

  var deleteButton = document.createElement('input');
  deleteButton.setAttribute('value', 'Delete');
  deleteButton.setAttribute('onclick', 'Delete(' + IdCounter + ')')
  deleteButton.setAttribute('type', 'button')
  deleteButton.setAttribute('class', 'w3-button w3-black w3-margin-bottom')
  deleteButton.style.position = 'absolute';
  deleteButton.style.bottom = '9px';
  deleteButton.style.right = '25px';

  // if city exists
  if (typeof response != 'string'){
    //Add city to title
    var t = document.createTextNode(city.toUpperCase() + ', ' + state);
    // find all keys and values and arrange them into a string format
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
  // if city does not exist
  else{
    let translated = Language(language, response)
    var t = document.createTextNode(translated);
  }

  //Append everything in order
  h.appendChild(t)
  div.appendChild(h)
  div.appendChild(ul)
  div.appendChild(deleteButton)
  // insert new card at the first position
  table.insertBefore(div, table.firstChild)
}


function Language(language, text){
  /*
    Translates text and returns translated text
  */

  if (language == 'English'){
    return text
  } 

  // Setup json post request to translation microservice
  var xml = new XMLHttpRequest();
  let textToTrans = {"Text":text, "Language":language};
  let translated
  xml.open('POST', 'http://flip3.engr.oregonstate.edu:1524/language', false);
  xml.setRequestHeader('Content-Type', 'application/json');
  xml.addEventListener('load', function(){
    //Successful
    if(xml.status >= 200 && xml.status < 400){
      var response = JSON.parse(xml.responseText);
      translated = response.output
      return translated
    }
    //Failed
    else{
      return "Something went wrong with the translation!"
    }
  });
  xml.send(JSON.stringify(textToTrans));
}

function Delete(el){
  /* 
    Function deletes the card that the user selects to delete 
  */
  // locate card by id number
  var element = document.getElementById(el);
  // delete card
  element.parentNode.removeChild(element);
}