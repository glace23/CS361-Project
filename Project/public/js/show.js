function Button(){
    var xml = new XMLHttpRequest();
    let text = {city:null, state:null};
    let city = document.getElementById('city').value;
    let state = document.getElementById('state').value;
    text.city = city
    text.state = state
    xml.open('POST', 'http://127.0.0.1:5000/taxdata', true);
    xml.setRequestHeader('Content-Type', 'application/json');
    xml.addEventListener('load', function(){
        if(xml.status >= 200 && xml.status < 400){
          var response = JSON.parse(xml.responseText);
          let total = 0
          let rates = city + ', ' + state + ': '
          if (xml.status == 201){
            Object.keys(response).forEach(function(key) {
              rates = rates + key + ": " + response[key] + '; ';
              if (key = 'total'){
                total = response[key]
              }
            });
            document.getElementById('rate').value = total 
            document.getElementById('showtax').textContent = rates;
          }
          else if(xml.status == 230){
            total = response
            document.getElementById('rate').value = total 
            document.getElementById('showtax').textContent = 'City does not exist, showing state rate instead. State: ' + total;
          }



        } 
        else {
          document.getElementById('data').textContent = "Error in network request: ";
        }
    });
    xml.send(JSON.stringify(text));
    event.preventDefault();
}


function Calculate(){
  amount = document.getElementById('amount').value;
  rate = parseFloat(document.getElementById('rate').value)/100;
  document.getElementById('calctax').textContent = 'Sales Tax = ' + amount*rate;
  document.getElementById('calctotal').textContent = 'Total (with Tax) = ' + amount*(1+rate);
}

function Clear(){
  document.getElementById('showtax').textContent = '';
  document.getElementById('amount').value = '';
  document.getElementById('rate').value = '';
  document.getElementById('calctax').textContent = '';
}