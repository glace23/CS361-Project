cityRate = 0
countyRate = 0
stateRate = 0
counter = 0
name = ""

function addCity(){
  document.getElementById("add").disabled = true;
  document.getElementById("add").setAttribute('value', 'Sending Data...')
  var t0 = performance.now()
  Button()
  var t1 = performance.now()
  setTimeout(function(){
    document.getElementById("add").disabled = false;
    document.getElementById("calculate").disabled = false;
    document.getElementById("add").setAttribute('value', 'Add')
  }, (t1-t0)*1000);

}

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
          let total = 0;
          name = city.toUpperCase() + ', ' + state;
          let rates = name + ': \r\n';
          if (xml.status == 201){
            // Object.keys(response).forEach(function(key) {
            //   rates = rates + key + ": " + response[key] + '; ';
            //   if (key = 'total'){
            //     total = response[key]
            //   }
            // });
            cityRate = response['city'];
            countyRate = response['county'];
            stateRate = response['state'];
            total = response['total'];
            rates += '> State Rate: ' + stateRate + '%\r\n' + '> County Rate: ' + countyRate + '%\r\n' + '> City Rate: ' + cityRate + '%\r\n' + '> Total Rate: ' + total + '%';

            document.getElementById('rate').value = total; 
            document.getElementById('showtax').textContent = rates;

          }

          else if(xml.status == 230){
            total = response
            cityRate = 0
            countyRate = 0
            stateRate = total
            name = state;
            document.getElementById('rate').value = total 
            document.getElementById('showtax').textContent = 'City does not exist, showing state tax rate instead. \r\n> State: ' + total + '%';

          }



        } 
        else {
          document.getElementById('data').textContent = JSON.parse(xml.responseText);
        }
    });

    xml.send(JSON.stringify(text));
    event.preventDefault();
}


function Calculate(){
  mode = document.getElementById('mode').value
  if (mode == 'Exclude'){
    CalcExlude()
  }
  else if (mode == 'Include'){
    CalcInclude()
  }
}


function CalcExlude(){
    var amount = document.getElementById('amount').value;
    var rate = parseFloat(document.getElementById('rate').value)/100;
    counter = counter + 1
    if (amount == '' || amount <= 0){
      alert('Amount is empty or invalid!')
      return
    }
    var table = document.getElementById('info');
    var div = document.createElement('div');

    var pAmount = document.createElement('p');
    pAmount.setAttribute('id', 'pAmount' + counter)
    var textAmount = document.createTextNode('Original Amount = $' + amount)
    pAmount.appendChild(textAmount)

    var pCityTax = document.createElement('p');
    pCityTax.setAttribute('id', 'pCityTax' + counter)
    var textCityTax = document.createTextNode('City Sales Tax = $' + (amount*cityRate/100).toFixed(2))
    pCityTax.appendChild(textCityTax)

    var pCountyTax = document.createElement('p');
    pCountyTax.setAttribute('id', 'pCountyTax' + counter)
    var textCountyTax = document.createTextNode('County Sales Tax = $' + (amount*countyRate/100).toFixed(2))
    pCountyTax.appendChild(textCountyTax)

    var pStateTax = document.createElement('p');
    pStateTax.setAttribute('id', 'pStateTax' + counter)
    var textStateTax = document.createTextNode('State Sales Tax = $' + (amount*stateRate/100).toFixed(2))
    pStateTax.appendChild(textStateTax)

    var pTax = document.createElement('p');
    pTax.setAttribute('id', 'pTax' + counter)
    var textTax = document.createTextNode('Total Sales Tax = $' + (amount*rate).toFixed(2))
    pTax.appendChild(textTax)
    
    var pTotal = document.createElement('p');
    pTotal.setAttribute('id', 'pTotal' + counter)
    var textTotal = document.createTextNode('Total (with Tax) = $' + (amount*(1+rate)).toFixed(2))
    pTotal.appendChild(textTotal);
    pTotal.style.fontWeight = 'bold';

    var h = document.createElement('H2');
    var hName = document.createTextNode(name)
    div.setAttribute('class','card');
    div.setAttribute('id', counter);

    var pSpace = document.createElement('p');
    var space = document.createTextNode(' \r\n');
    pSpace.appendChild(space);


    var deleteButton = document.createElement('input');
    deleteButton.setAttribute('value', 'Delete');
    deleteButton.setAttribute('onclick', 'Delete(' + counter + ')')
    deleteButton.setAttribute('type', 'button')

    var editButton = document.createElement('input');
    editButton.setAttribute('value', 'Edit');
    editButton.setAttribute('onclick', 'Edit(' + counter + ')')
    editButton.setAttribute('type', 'button');

    var amountInput = document.createElement('input');
    amountInput.setAttribute('type', 'number');
    amountInput.setAttribute('id', 'amount' + counter);
    amountInput.setAttribute('value', amount);
    amountInput.style.visibility = "hidden"

    var label = document.createElement('label');
    label.textContent = 'Dollar Amount: $';
    label.style.visibility = "hidden"
    label.appendChild(amountInput)
    label.setAttribute('id', 'labelAmount' + counter)

    var changeButton = document.createElement('input');
    changeButton.setAttribute('value', 'Change');
    changeButton.setAttribute('onclick', 'ChangeValue(' + counter + ')')
    changeButton.setAttribute('type', 'button');
    changeButton.setAttribute('id', 'changeButton' + counter)
    changeButton.style.visibility = "hidden"

    var cityTax = document.createElement('input');
    cityTax.setAttribute('type', 'number');
    cityTax.setAttribute('id', 'cityTax' + counter);
    cityTax.setAttribute('value', cityRate);
    cityTax.style.visibility = "hidden"

    var countyTax = document.createElement('input');
    countyTax.setAttribute('type', 'number');
    countyTax.setAttribute('id', 'countyTax' + counter);
    countyTax.setAttribute('value', countyRate);
    countyTax.style.visibility = "hidden"

    var stateTax = document.createElement('input');
    stateTax.setAttribute('type', 'number');
    stateTax.setAttribute('id', 'stateTax' + counter);
    stateTax.setAttribute('value', stateRate);
    stateTax.style.visibility = "hidden"

    var taxMode = document.createElement('input');
    taxMode.setAttribute('type', 'text');
    taxMode.setAttribute('id', 'taxMode' + counter);
    taxMode.setAttribute('value', 'Exclude');
    taxMode.style.visibility = "hidden"

    h.appendChild(hName)
    div.appendChild(h)
    div.appendChild(pAmount)
    div.appendChild(pCityTax)
    div.appendChild(pCountyTax)
    div.appendChild(pStateTax)
    div.appendChild(pTax)
    div.appendChild(pTotal)
    div.appendChild(editButton)
    div.appendChild(deleteButton)
    div.style.whiteSpace = "pre";
    div.appendChild(pSpace)
    div.appendChild(label)
    div.appendChild(changeButton)
    div.appendChild(cityTax)
    div.appendChild(countyTax)
    div.appendChild(stateTax)
    div.appendChild(taxMode)
    table.insertBefore(div, table.firstChild)
}

function CalcInclude(){
    var amount = document.getElementById('amount').value;
    var rate = parseFloat(document.getElementById('rate').value)/100;
    counter = counter + 1
    if (amount == '' || amount <= 0){
      alert('Amount is empty or invalid!')
      return
    }
    var updatedAmount = (amount/(1+rate)).toFixed(2)

    var table = document.getElementById('info');
    var div = document.createElement('div');

    var pAmount = document.createElement('p');
    pAmount.setAttribute('id', 'pAmount' + counter)
    var textAmount = document.createTextNode('Original Amount = $' + amount)
    pAmount.appendChild(textAmount)

    var pCityTax = document.createElement('p');
    pCityTax.setAttribute('id', 'pCityTax' + counter)
    var textCityTax = document.createTextNode('City Sales Tax = $' + (updatedAmount*cityRate/100).toFixed(2))
    pCityTax.appendChild(textCityTax)

    var pCountyTax = document.createElement('p');
    pCountyTax.setAttribute('id', 'pCountyTax' + counter)
    var textCountyTax = document.createTextNode('County Sales Tax = $' + (updatedAmount*countyRate/100).toFixed(2))
    pCountyTax.appendChild(textCountyTax)

    var pStateTax = document.createElement('p');
    pStateTax.setAttribute('id', 'pStateTax' + counter)
    var textStateTax = document.createTextNode('State Sales Tax = $' + (updatedAmount*stateRate/100).toFixed(2))
    pStateTax.appendChild(textStateTax)

    var pTax = document.createElement('p');
    pTax.setAttribute('id', 'pTax' + counter)
    var textTax = document.createTextNode('Total Sales Tax = $' + (updatedAmount*rate).toFixed(2))
    pTax.appendChild(textTax)
    
    var pTotal = document.createElement('p');
    pTotal.setAttribute('id', 'pTotal' + counter)
    var textTotal = document.createTextNode('Total (without Tax) = $' + updatedAmount)
    pTotal.appendChild(textTotal);
    pTotal.style.fontWeight ='bold';

    var h = document.createElement('H2');
    var hName = document.createTextNode(name)
    div.setAttribute('class','card');
    div.setAttribute('id', counter);

    var pSpace = document.createElement('p');
    var space = document.createTextNode(' \r\n');
    pSpace.appendChild(space);


    var deleteButton = document.createElement('input');
    deleteButton.setAttribute('value', 'Delete');
    deleteButton.setAttribute('onclick', 'Delete(' + counter + ')')
    deleteButton.setAttribute('type', 'button')

    var editButton = document.createElement('input');
    editButton.setAttribute('value', 'Edit');
    editButton.setAttribute('onclick', 'Edit(' + counter + ')')
    editButton.setAttribute('type', 'button');

    var amountInput = document.createElement('input');
    amountInput.setAttribute('type', 'number');
    amountInput.setAttribute('id', 'amount' + counter);
    amountInput.setAttribute('value', amount);
    amountInput.style.visibility = "hidden"

    var label = document.createElement('label');
    label.textContent = 'Dollar Amount: $';
    label.style.visibility = "hidden"
    label.appendChild(amountInput)
    label.setAttribute('id', 'labelAmount' + counter)

    var changeButton = document.createElement('input');
    changeButton.setAttribute('value', 'Change');
    changeButton.setAttribute('onclick', 'ChangeValue(' + counter + ')')
    changeButton.setAttribute('type', 'button');
    changeButton.setAttribute('id', 'changeButton' + counter)
    changeButton.style.visibility = "hidden"

    var cityTax = document.createElement('input');
    cityTax.setAttribute('type', 'number');
    cityTax.setAttribute('id', 'cityTax' + counter);
    cityTax.setAttribute('value', cityRate);
    cityTax.style.visibility = "hidden"

    var countyTax = document.createElement('input');
    countyTax.setAttribute('type', 'number');
    countyTax.setAttribute('id', 'countyTax' + counter);
    countyTax.setAttribute('value', countyRate);
    countyTax.style.visibility = "hidden"

    var stateTax = document.createElement('input');
    stateTax.setAttribute('type', 'number');
    stateTax.setAttribute('id', 'stateTax' + counter);
    stateTax.setAttribute('value', stateRate);
    stateTax.style.visibility = "hidden"

    var taxMode = document.createElement('input');
    taxMode.setAttribute('type', 'text');
    taxMode.setAttribute('id', 'taxMode' + counter);
    taxMode.setAttribute('value', 'Include');
    taxMode.style.visibility = "hidden"

    h.appendChild(hName)
    div.appendChild(h)
    div.appendChild(pAmount)
    div.appendChild(pCityTax)
    div.appendChild(pCountyTax)
    div.appendChild(pStateTax)
    div.appendChild(pTax)
    div.appendChild(pTotal)
    div.appendChild(editButton)
    div.appendChild(deleteButton)
    div.style.whiteSpace = "pre";
    div.appendChild(pSpace)
    div.appendChild(label)
    div.appendChild(changeButton)
    div.appendChild(cityTax)
    div.appendChild(countyTax)
    div.appendChild(stateTax)
    div.appendChild(taxMode)
    table.insertBefore(div, table.firstChild)
}

function Clear(){
  document.getElementById('showtax').textContent = '';
  document.getElementById('amount').value = '';
  document.getElementById('rate').value = '';
  document.getElementById('calctax').textContent = '';
  document.getElementById("calculate").disabled = true;

}


function Delete(el){
  var element = document.getElementById(el);
  element.parentNode.removeChild(element);
}

function Edit(el){
  var element = document.getElementById('amount' + el);
  element.style.visibility = "visible"
  var label = document.getElementById('labelAmount' + el)
  label.style.visibility = "visible"
  var button = document.getElementById('changeButton' + el)
  button.style.visibility = "visible"
}

function ChangeValue(el){  
  var mode = document.getElementById('taxMode' + el).value
  if (mode == 'Exclude'){
    ChangeValExclude(el)
  }
  else if (mode == 'Include'){
    ChangeValInclude(el)
  }
}

function ChangeValExclude(el){
  var pTax = document.getElementById('pTax' + el)
  var pTotal = document.getElementById('pTotal' + el)
  var pAmount= document.getElementById('pAmount' + el)
  var pCityTax= document.getElementById('pCityTax' + el)
  var pCountyTax = document.getElementById('pCountyTax' + el)
  var pStateTax = document.getElementById('pStateTax' + el)


  var amount = parseFloat(document.getElementById('amount' + el).value)
  var cityTax = parseFloat(document.getElementById('cityTax' + el).value)
  var countyTax = parseFloat(document.getElementById('countyTax' + el).value)
  var stateTax = parseFloat(document.getElementById('stateTax' + el).value)
  var rate = (cityTax + countyTax + stateTax)/100
  var textTax = document.createTextNode('Sales Tax = $' + (amount*rate).toFixed(2))
  var textTotal = document.createTextNode('Total (with Tax) = $' + (amount*(1+rate)).toFixed(2))
  var textAmount = document.createTextNode('Original Amount = $' + amount)
  var textCityTax = document.createTextNode('City Sales Tax = $' + (amount*cityTax/100).toFixed(2))
  var textCountyTax = document.createTextNode('County Sales Tax = $' + (amount*countyTax/100).toFixed(2))
  var textStateTax = document.createTextNode('State Sales Tax = $' + (amount*stateTax/100).toFixed(2))

  pTax.removeChild(pTax.childNodes[0])
  pTotal.removeChild(pTotal.childNodes[0])
  pAmount.removeChild(pAmount.childNodes[0])
  pCityTax.removeChild(pCityTax.childNodes[0])
  pCountyTax.removeChild(pCountyTax.childNodes[0])
  pStateTax.removeChild(pStateTax.childNodes[0])

  pTax.appendChild(textTax)
  pTotal.appendChild(textTotal)
  pAmount.appendChild(textAmount)
  pCityTax.appendChild(textCityTax)
  pCountyTax.appendChild(textCountyTax)
  pStateTax.appendChild(textStateTax)

  var element = document.getElementById('amount' + el);
  element.style.visibility = "hidden"
  var label = document.getElementById('labelAmount' + el)
  label.style.visibility = "hidden"
  var button = document.getElementById('changeButton' + el)
  button.style.visibility = "hidden"
}

function ChangeValInclude(el){
  var pTax = document.getElementById('pTax' + el)
  var pTotal = document.getElementById('pTotal' + el)
  var pAmount= document.getElementById('pAmount' + el)
  var pCityTax= document.getElementById('pCityTax' + el)
  var pCountyTax = document.getElementById('pCountyTax' + el)
  var pStateTax = document.getElementById('pStateTax' + el)


  var amount = parseFloat(document.getElementById('amount' + el).value)
  var cityTax = parseFloat(document.getElementById('cityTax' + el).value)
  var countyTax = parseFloat(document.getElementById('countyTax' + el).value)
  var stateTax = parseFloat(document.getElementById('stateTax' + el).value)
  var rate = (cityTax + countyTax + stateTax)/100
  var updatedAmount = (amount/(1+rate)).toFixed(2)
  var textTax = document.createTextNode('Sales Tax = $' + (updatedAmount*rate).toFixed(2))
  var textTotal = document.createTextNode('Total (without Tax) = $' + updatedAmount)
  var textAmount = document.createTextNode('Original Amount = $' + amount)
  var textCityTax = document.createTextNode('City Sales Tax = $' + (updatedAmount*cityTax/100).toFixed(2))
  var textCountyTax = document.createTextNode('County Sales Tax = $' + (updatedAmount*countyTax/100).toFixed(2))
  var textStateTax = document.createTextNode('State Sales Tax = $' + (updatedAmount*stateTax/100).toFixed(2))

  pTax.removeChild(pTax.childNodes[0])
  pTotal.removeChild(pTotal.childNodes[0])
  pAmount.removeChild(pAmount.childNodes[0])
  pCityTax.removeChild(pCityTax.childNodes[0])
  pCountyTax.removeChild(pCountyTax.childNodes[0])
  pStateTax.removeChild(pStateTax.childNodes[0])

  pTax.appendChild(textTax)
  pTotal.appendChild(textTotal)
  pAmount.appendChild(textAmount)
  pCityTax.appendChild(textCityTax)
  pCountyTax.appendChild(textCountyTax)
  pStateTax.appendChild(textStateTax)

  var element = document.getElementById('amount' + el);
  element.style.visibility = "hidden"
  var label = document.getElementById('labelAmount' + el)
  label.style.visibility = "hidden"
  var button = document.getElementById('changeButton' + el)
  button.style.visibility = "hidden"
}