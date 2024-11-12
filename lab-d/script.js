klucz='8c9f0c4ffc850c81dedba79af612f6cc';
miasto=document.getElementById('miasto');
pogoda=document.getElementById('pogoda');
wynik=document.getElementById('wynik');

function aktualna_pogoda(miasto){
    zapytanie=new XMLHttpRequest();
    zapytanie.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=${miasto}&appid=${klucz}&units=metric&lang=pl')

    zapytanie.onload=()=>{       
            dane=JSON.parse(zapytanie.responseText);
    };
    zapytanie.send();
}
function pogoda_5dni(miasto){
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=${miasto}&appid=${klucz}&units=metric&lang=pl')
    .then(response=>response.json())
    .then(dane=>displayForecast(data))
    .catch(blad=>console.error('blad pobierania danych ze strony: ',blad));
}

function pokaz_pogode(dane){

}