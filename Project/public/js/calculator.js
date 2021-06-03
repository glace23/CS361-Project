//Keep track of current sales tax rate and name
var cityRate = 0
var countyRate = 0
var stateRate = 0
var name = ""
//keeps track of element ID
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
  getTaxRateFromCity()
  var t1 = performance.now()

  // sets time for add button to functioning again
  setTimeout(function(){
    document.getElementById("add").disabled = false;
    document.getElementById("add").setAttribute('value', 'Add')
  }, (t1-t0)*1000);
}


function getTaxRateFromCity(){
  /*
    Gets city tax rates from microservice and show on to webpage
  */

  // set up post request
  var xml = new XMLHttpRequest();
  let text = {city:null, state:null};
  let city = document.getElementById('city').value;
  let state = document.getElementById('state').value;
  // default value for city when state is DC
  if(state == 'DC') {city = 'Washington'};
  text.city = city
  text.state = state
  xml.open('POST', 'http://127.0.0.1:5000/taxdata', true);
  xml.setRequestHeader('Content-Type', 'application/json');
  xml.addEventListener('load', function(){
    //Sucess
    if(xml.status >= 200 && xml.status < 400){
      var response = JSON.parse(xml.responseText);

      // enable calculate button and amount input only if xml status is good
      document.getElementById("calculate").disabled = false;
      document.getElementById("amount").disabled = false;

      let total = 0;
      name = city.toUpperCase() + ', ' + state;
      let rates = name + ': \r\n';

      // if city exists in state
      if (xml.status == 201){
        cityRate = response['city'];
        countyRate = response['county'];
        stateRate = response['state'];
        total = response['total'];
        rates += '> State Rate: ' + stateRate + '%\r\n' + '> County Rate: ' + countyRate + '%\r\n' 
                + '> City Rate: ' + cityRate + '%\r\n' + '> Total Rate: ' + total + '%';

        //show tax rates
        document.getElementById('rate').value = total; 
        document.getElementById('showtax').textContent = rates;
        document.getElementById('showtax').style.visibility = 'visible'

      }
      // city does not exist in state
      else if(xml.status == 230){
        total = response
        cityRate = 0
        countyRate = 0
        stateRate = total
        name = state;

        //show tax rates
        document.getElementById('rate').value = total 
        document.getElementById('showtax').textContent = 'City does not exist.\r\n' + state + '\r\n> State: ' + total + '%';
        document.getElementById('showtax').style.visibility = 'visible'

      }
    } 
    //Failed
    else {
      document.getElementById('showtax').textContent = JSON.parse(xml.responseText);
      document.getElementById('showtax').style.visibility = 'visible'
    }
  });
  xml.send(JSON.stringify(text));
  event.preventDefault();
}


function showTaxResults(){
  /*
    Calculates sales tax and total amount according to select mode
  */

  //Checks whether calculator is in advanced mode
  checkAdvancedRate()

  

  // disable and change add button to send data when user sends calculate request
  document.getElementById("calculate").disabled = true;
  document.getElementById("calculate").setAttribute('value', 'Calculating Data...')

  //Calculates value of sales tax
  CalculateValue()

  // sets time for calculate button to functioning again
  setTimeout(function(){
    document.getElementById("calculate").disabled = false;
    document.getElementById("calculate").setAttribute('value', 'Calculate')
  }, 300);
}


function CalculateValue(){
  /*
    Calculates value for rate and total amount
  */
  var mode = document.getElementById('mode').value;
  var amount = document.getElementById('amount').value;
  var rate = document.getElementById('rate').value;

  // if rate or amount has error alert user
  if (rate == '' || rate < 0){
    alert('Rate is empty or negative!')
    return
  }
  if (amount == '' || amount <= 0){
    alert('Amount is empty or invalid!')
    return
  }

  IdCounter = IdCounter + 1;
  rate = parseFloat(rate)/100;

  if (mode == 'Exclude'){
    var excludeTaxAmount = amount;
    var includeTaxAmount = (amount*(1+rate)).toFixed(2);
  }
  else if (mode == 'Include'){
    var includeTaxAmount = amount;
    var excludeTaxAmount = (amount/(1+rate)).toFixed(2);
  }

  //Add card to page
  createCard(mode, amount,  rate, excludeTaxAmount, includeTaxAmount);
}


function createCard(mode, originalAmount, rate, excludeTaxAmount, includeTaxAmount){
  /*
    Creates sales tax card via DOM objects and put on webpage
  */

  var table = document.getElementById('info');

  var div = document.createElement('div');
  div.setAttribute('class','card');
  div.setAttribute('id', IdCounter);
  div.style.whiteSpace = "pre";
  div.style.position = "relative";
  div.style.overflow = "hidden";

  var pAmount = document.createElement('p');
  pAmount.setAttribute('id', 'pAmount' + IdCounter)
  var textAmount = document.createTextNode('Original Amount = $' + originalAmount)
  pAmount.appendChild(textAmount)

  var pCityTax = document.createElement('p');
  pCityTax.setAttribute('id', 'pCityTax' + IdCounter)
  var textCityTax = document.createTextNode('City Sales Tax = $' + (excludeTaxAmount*cityRate/100).toFixed(2))
  pCityTax.appendChild(textCityTax)

  var pCountyTax = document.createElement('p');
  pCountyTax.setAttribute('id', 'pCountyTax' + IdCounter)
  var textCountyTax = document.createTextNode('County Sales Tax = $' + (excludeTaxAmount*countyRate/100).toFixed(2))
  pCountyTax.appendChild(textCountyTax)

  var pStateTax = document.createElement('p');
  pStateTax.setAttribute('id', 'pStateTax' + IdCounter)
  var textStateTax = document.createTextNode('State Sales Tax = $' + (excludeTaxAmount*stateRate/100).toFixed(2))
  pStateTax.appendChild(textStateTax)

  var pTax = document.createElement('p');
  pTax.setAttribute('id', 'pTax' + IdCounter)
  var textTax = document.createTextNode('Total Sales Tax = $' + (excludeTaxAmount*rate).toFixed(2))
  pTax.appendChild(textTax)
  
  var pTotal = document.createElement('p');
  pTotal.setAttribute('id', 'pTotal' + IdCounter)
  //Check mode to see which result to put in total
  if (mode == 'Exclude'){
    var textTotal = document.createTextNode('Total (with Tax) = $' + includeTaxAmount)
  }
  else if (mode == 'Include'){
    var textTotal = document.createTextNode('Total (without Tax) = $' + excludeTaxAmount)
  }
  pTotal.appendChild(textTotal);
  pTotal.style.fontWeight = 'bold';

  var h = document.createElement('H2');
  var hName = document.createTextNode(name + ' - ' + (rate*100).toFixed(2) + '%')

  var pSpace = document.createElement('p');
  var space = document.createTextNode(' \r\n');
  pSpace.appendChild(space);

  var deleteButton = document.createElement('input');
  deleteButton.setAttribute('value', 'Delete');
  deleteButton.setAttribute('onclick', 'Delete(' + IdCounter + ')')
  deleteButton.setAttribute('type', 'button')
  deleteButton.setAttribute('class', 'w3-button w3-black w3-margin-bottom')
  deleteButton.style.position = "absolute";
  deleteButton.style.right = '25px'
  deleteButton.style.bottom = '9px'

  var editButton = document.createElement('input');
  editButton.setAttribute('value', 'Edit');
  editButton.setAttribute('onclick', 'showEdit(' + IdCounter + ')')
  editButton.setAttribute('type', 'button');
  editButton.setAttribute('class', 'w3-button w3-black w3-margin-bottom');
  editButton.style.position = "absolute";
  editButton.style.right = '110px';
  editButton.style.bottom = '9px';

  var amountInput = document.createElement('input');
  amountInput.setAttribute('type', 'number');
  amountInput.setAttribute('id', 'amount' + IdCounter);
  amountInput.setAttribute('value', amount);
  amountInput.style.visibility = "hidden"

  var label = document.createElement('label');
  label.textContent = 'Dollar Amount: $';
  label.style.visibility = "hidden"
  label.appendChild(amountInput)
  label.setAttribute('id', 'labelAmount' + IdCounter)

  var changeButton = document.createElement('input');
  changeButton.setAttribute('value', 'Change');
  changeButton.setAttribute('onclick', 'ChangeValue(' + IdCounter + ')')
  changeButton.setAttribute('type', 'button');
  changeButton.setAttribute('id', 'changeButton' + IdCounter)
  changeButton.setAttribute('class', 'w3-button w3-black w3-margin-bottom')
  changeButton.style.visibility = "hidden"
  changeButton.style.clear = 'left'

  var cityTax = document.createElement('input');
  cityTax.setAttribute('type', 'number');
  cityTax.setAttribute('id', 'cityTax' + IdCounter);
  cityTax.setAttribute('value', cityRate);
  cityTax.style.visibility = "hidden"

  var countyTax = document.createElement('input');
  countyTax.setAttribute('type', 'number');
  countyTax.setAttribute('id', 'countyTax' + IdCounter);
  countyTax.setAttribute('value', countyRate);
  countyTax.style.visibility = "hidden"

  var stateTax = document.createElement('input');
  stateTax.setAttribute('type', 'number');
  stateTax.setAttribute('id', 'stateTax' + IdCounter);
  stateTax.setAttribute('value', stateRate);
  stateTax.style.visibility = "hidden"

  var totalTax = document.createElement('input');
  totalTax.setAttribute('type', 'number');
  totalTax.setAttribute('id', 'totalTax' + IdCounter);
  totalTax.setAttribute('value', rate*100);
  totalTax.style.visibility = "hidden"

  var taxMode = document.createElement('input');
  taxMode.setAttribute('type', 'text');
  taxMode.setAttribute('id', 'taxMode' + IdCounter);
  taxMode.setAttribute('value', mode);
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
  div.appendChild(pSpace)
  div.appendChild(label)
  div.appendChild(document.createElement('br'))
  div.appendChild(changeButton)
  div.appendChild(cityTax)
  div.appendChild(countyTax)
  div.appendChild(stateTax)
  div.appendChild(totalTax)
  div.appendChild(taxMode)
  //append item to first position
  table.insertBefore(div, table.firstChild)
}

function ClearForm(){
  /*
    Resets all value to default
  */
  document.getElementById('city').value = '';
  document.getElementById('showtax').textContent = '';
  document.getElementById('amount').value = 0;
  document.getElementById('rate').value = 0;
  document.getElementById("calculate").disabled = true;
  document.getElementById('cityRate').value = 0;
  document.getElementById('countyRate').value = 0;
  document.getElementById('stateRate').value = 0;
  cityRate = 0
  countyRate = 0
  stateRate = 0
  name = ""

}


function Delete(el){
  /*
    Deletes card
  */
  var element = document.getElementById(el);

  //Delete card
  element.parentNode.removeChild(element);
}

function showEdit(el){
  /*
    shows user amount value of the card to edit
  */
  var element = document.getElementById('amount' + el);
  element.style.visibility = "visible"
  var label = document.getElementById('labelAmount' + el)
  label.style.visibility = "visible"
  var button = document.getElementById('changeButton' + el)
  button.style.visibility = "visible"
}

function ChangeValue(el){ 
  /*
    When user changes original amount via Edit and recalculates corresponding values
  */ 

  //Calculate changed values
  var elMode = document.getElementById('taxMode' + el).value
  var elAmount = parseFloat(document.getElementById('amount' + el).value)
  var elCityTax = (elAmount*parseFloat(document.getElementById('cityTax' + el).value)/100).toFixed(2)
  var elCountyTax = (elAmount*parseFloat(document.getElementById('countyTax' + el).value)/100).toFixed(2)
  var elStateTax = (elAmount*parseFloat(document.getElementById('stateTax' + el).value)/100).toFixed(2)
  var elTotalTax = (elAmount*parseFloat(document.getElementById('totalTax' + el).value)/100).toFixed(2)
  if (elMode == 'Exclude'){
  var originalTaxAmount = elAmount
  var updatedTaxAmount = (parseFloat(elAmount) + parseFloat(elTotalTax)).toFixed(2)
  }
  else if (elMode == 'Include'){
  var originalTaxAmount = elAmount
  var updatedTaxAmount = (parseFloat(elAmount) - parseFloat(elTotalTax)).toFixed(2)
  }

  //Updated card
  ShowChangedValue(el, originalTaxAmount, updatedTaxAmount, elMode, elCityTax, elCountyTax, elStateTax, elTotalTax)

}

function ShowChangedValue(el, originalTaxAmount, updatedTaxAmount, elMode, elCityTax, elCountyTax, elStateTax, elTotalTax){
  /*
    Updates card to show changes to new value on webpage
  */
  var pTax = document.getElementById('pTax' + el)
  var pTotal = document.getElementById('pTotal' + el)
  var pAmount= document.getElementById('pAmount' + el)
  var pCityTax= document.getElementById('pCityTax' + el)
  var pCountyTax = document.getElementById('pCountyTax' + el)
  var pStateTax = document.getElementById('pStateTax' + el)

  var textTax = document.createTextNode('Sales Tax = $' + elTotalTax)
  var textCityTax = document.createTextNode('City Sales Tax = $' + elCityTax)
  var textCountyTax = document.createTextNode('County Sales Tax = $' + elCountyTax)
  var textStateTax = document.createTextNode('State Sales Tax = $' + elStateTax)

  //Show with or without tax based on element's mode
  if (elMode == 'Exclude'){
    var textTotal = document.createTextNode('Total (with Tax) = $' + updatedTaxAmount) 
    var textAmount = document.createTextNode('Original Amount = $' + originalTaxAmount)
  }
  else if (elMode == 'Include'){
    var textTotal = document.createTextNode('Total (without Tax) = $' + updatedTaxAmount) 
    var textAmount = document.createTextNode('Original Amount = $' + originalTaxAmount)
  }

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


function baseMode(){
  /*
    Shows user base mode of the calculator
  */
  ClearForm();

  //Uodate GUI
  document.getElementById('showtax').style.visibility = "hidden";
  document.getElementById('baseMode').disabled = true;
  document.getElementById('customMode').disabled = false;
  document.getElementById('rate').disabled = true;
  document.getElementById('calculate').disabled = true;
  document.getElementById('amount').disabled = true;
  document.getElementById('advancedlabel').style.display = "none";
  document.getElementById('advancedMode').style.display = "none";
  document.getElementById('advanced').checked = false;
  //show add city functions
  document.getElementById('cityMode').style.display = "";
}

function customMode(){
  /*
    Shows user custom mode of the calculator
  */
  ClearForm();

  //Uodate GUI
  name = 'Custom';
  document.getElementById('amount').disabled = false;
  document.getElementById('baseMode').disabled = false;
  document.getElementById('customMode').disabled = true;
  document.getElementById('rate').disabled = false;
  document.getElementById('calculate').disabled = false;
  document.getElementById('advancedlabel').style.display = "";
  //Hide add city functions
  document.getElementById('cityMode').style.display = "none";
}


function showAdvancedFunctions(){
  /*
    Shows advanced functions when user checks checkbox
  */
  advancedCheckBox = document.getElementById('advanced');
  advancedMode = document.getElementById('advancedMode');
  rateInput = document.getElementById('rate');
  if (advancedCheckBox.checked == true){
    advancedMode.style.display = "";
    rateInput.disabled = true;
  }
  else if (advancedCheckBox.checked == false){
    advancedMode.style.display = "none";
    rateInput.disabled = false;
  }
}

function checkAdvancedRate(){
  /*
    Checks whether user's advanced rate's values
  */
  advancedCheckBox = document.getElementById('advanced');
  if (advancedCheckBox.checked == true){
    cityRate = parseFloat(document.getElementById('cityRate').value);
    countyRate = parseFloat(document.getElementById('countyRate').value);
    stateRate = parseFloat(document.getElementById('stateRate').value);
    totalRate = cityRate + countyRate + stateRate;
    document.getElementById('rate').value = totalRate;
  }
}


function findSalesTaxTable(){
  /*
    Finds sales tax table for all states
  */
  element = document.getElementById('stateTaxLookUp')
  // if tax table has not been searched
  if (element.value == 'false'){
    //intialize post request
    var xml = new XMLHttpRequest();
    let text = {city:'null', state:'null'};
    xml.open('POST', 'http://127.0.0.1:5000/salestaxtabledata', true);
    xml.setRequestHeader('Content-Type', 'application/json');
    xml.addEventListener('load', function(){
      //Success
      if(xml.status >= 200 && xml.status < 400){
        var response = JSON.parse(xml.responseText);
        // sucessful tax table return
        if (xml.status == 201){
          document.getElementById('salesTaxTable').innerHTML = response['table']; 
          document.getElementById('salesTaxTableView').style.display = "";
        }
        // failed tax table return
        else if(xml.status == 230){
          document.getElementById('salesTaxTable').innerHTML = response
          document.getElementById('salesTaxTableView').style.display = "";
        }
      } 
      //Failed
      else {
        document.getElementById('salesTaxTable').innerHTML = JSON.parse(xml.responseText);
        document.getElementById('salesTaxTableView').style.display = "";
      }
    });
    xml.send(JSON.stringify(text));
    event.preventDefault();
  }

  // tax table has been searched
  else{
    document.getElementById('salesTaxTableView').style.display = "";
  }
  //change tax table value to searched
  element.value = 'true'
}

function hideTable(){
  /*
    hides table
  */
  document.getElementById('salesTaxTableView').style.display = "none";
}