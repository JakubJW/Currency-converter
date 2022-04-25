const baseSelect = document.getElementById("base");
const expectedSelect = document.getElementById("expected");
const calculateBtn = document.getElementById("letsgo");
const quantityInput = document.getElementById("quantity");
const output = document.getElementById("output");

//funkcja zwracająca wartość wybranej w select waluty

var currencyBase = "";
var currencyExpected = "";

baseSelect.addEventListener("click", function(e){
    currencyBase = e.target.value;
});

expectedSelect.addEventListener("click", function(e){
    currencyExpected = e.target.value;
});

//funkcja przyjmująca wartość powyższej funkcji, wklejająca ją do url api np i zwracająca kurs waluty

calculateBtn.addEventListener("click", async function(){
    this.classList.add("buttonAnimation");
    this.addEventListener("transitionend", function(){
        this.classList.remove("buttonAnimation")
    });

    output.classList.add("outputAnimation");
    output.addEventListener("transitionend", function(){
        this.classList.remove("outputAnimation");
    });

    let value1 = 0;
    let value2 = 0;
    let quantity = parseFloat(quantityInput.value);
    
    value1 = await getData(value1, currencyBase);
    value2 = await getData(value2, currencyExpected);

    //funkcja obliczająca i printująca wynik
    let result = calculate(quantity, value1, value2);
    result = result.toString();
    result = result.substring(0, 6);
    output.innerText = quantity + currencyBase + " is " + result + currencyExpected;
});

const setData = function(element, value){
    return element = value;
}

const setHttpRequest = function(method, url, data){
    return fetch(url, {
        method: method,
        body: JSON.stringify(data)
    }).then(
        function(response) {
        return response.json();
    });
};

const getData = async function(element, currency){
    return setHttpRequest('GET', 'http://api.nbp.pl/api/exchangerates/rates/A/' + currency).then(
        function(responseData) {
        return setData(element, responseData.rates[0].mid);
    });
};

const fillSelectMenu = async function(element){
    return setHttpRequest('GET', 'http://api.nbp.pl/api/exchangerates/tables/A/').then(
        function(responseData){
            return setData(element, responseData[0].rates);
        });
};

document.addEventListener("DOMContentLoaded", async function(){
    let valueArray;
    valueArray = await fillSelectMenu(valueArray);
    for(var i=0 ; i < valueArray.length; i++){
        const option = document.createElement("option");
        option.setAttribute("value", valueArray[i].code);
        option.innerText = valueArray[i].currency;
        baseSelect.appendChild(option);
    }

    for(var i=0 ; i < valueArray.length; i++){
        const option = document.createElement("option");
        option.innerText = valueArray[i].code;
        option.setAttribute("value", valueArray[i].code);
        option.innerText = valueArray[i].currency;
        expectedSelect.appendChild(option);
    }

    currencyBase = setData(currencyBase, baseSelect.firstElementChild.value);
    currencyExpected = setData(currencyBase, expectedSelect.firstElementChild.value);
});

const calculate = function(input, val1, val2){
    return input * val1*(1/val2);
}