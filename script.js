const baseSelect = document.getElementById("base");
const expectedSelect = document.getElementById("expected");
const calculateBtn = document.getElementById("letsgo");
const quantityInput = document.getElementById("quantity");
const output = document.getElementById("output");

var currencyBase = "EUR";
var currencyExpected = "EUR";

//funkcja zwracająca wartość wybranej w select waluty

baseSelect.addEventListener("click", function(e){
    currencyBase = e.target.value;
});

expectedSelect.addEventListener("click", function(e){
    currencyExpected = e.target.value;
});

//funkcja przyjmująca wartość powyższej funkcji, wklejająca ją do url api np i zwracająca kurs waluty

calculateBtn.addEventListener("click", async function(){
    let value1 = 0;
    let value2 = 0;
    let quantity = parseFloat(quantityInput.value);
    
    value1 = await getData(value1, currencyBase);
    value2 = await getData(value2, currencyExpected);

    //funkcja obliczająca i printująca wynik
    let result = calculate(quantity, value1, value2);
    result = result.toString();
    result = result.substring(0, 4);
    output.innerText = quantity + currencyBase + " to " + result + currencyExpected;
});

const setData = function(element, value){
    return element = parseFloat(value);
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

const calculate = function(input, val1, val2){
    return input * val1*(1/val2);
}