const klucz = '8c9f0c4ffc850c81dedba79af612f6cc';
const miastoInput = document.getElementById('miasto');
const pogodaButton = document.getElementById('pogoda');
const wynikDiv = document.getElementById('wynik');

function aktualnaPogoda(miasto) {
    const zapytanie = new XMLHttpRequest();
    zapytanie.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${miasto}&appid=${klucz}&units=metric&lang=pl`);

    zapytanie.onload = () => {
        if (zapytanie.status === 200) {
            const dane = JSON.parse(zapytanie.responseText);
            console.log("Odpowiedź API dla aktualnej pogody:", dane);
            pokazPogode(dane, "aktualna");
        } else {
            wynikDiv.innerHTML = `<p>Nie udało się pobrać aktualnej pogody: ${zapytanie.status}</p>`;
        }
    };

    zapytanie.onerror = () => {
        wynikDiv.innerHTML = `<p>Wystąpił błąd podczas łączenia z serwerem.</p>`;
    };

    zapytanie.send();
}

function pogoda5Dni(miasto) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${miasto}&appid=${klucz}&units=metric&lang=pl`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(dane => {
            console.log("Odpowiedź API dla prognozy 5 dniowej:", dane);
            pokazPogode(dane, "prognoza");
        })
        .catch(blad => {
            wynikDiv.innerHTML += `<p>Nie udało się pobrać prognozy pogody: ${blad.message}</p>`;
        });
}


function pokazPogode(dane, typ) {
    if (typ === "aktualna") {
        const ikona = dane.weather[0].icon; // Kod ikony z API
        wynikDiv.innerHTML = `
            <div id="aktualna-pogoda">
                <h2>Aktualna pogoda w ${dane.name}:</h2>
                <img src="https://openweathermap.org/img/wn/${ikona}@2x.png" alt="${dane.weather[0].description}">
                <p>Temperatura: ${dane.main.temp}°C</p>
                <p>Wilgotność: ${dane.main.humidity}%</p>
                <p>Prędkość wiatru: ${dane.wind.speed} m/s</p> <!-- Dodano prędkość wiatru -->
            </div>
        `;
    } else if (typ === "prognoza") {
        // Wyciągamy prognozy z każdego dnia
        const prognozy = [];
        let currentDate = null;

        // Iterujemy po prognozach, aby wyciągnąć tylko jeden wpis na każdy dzień
        dane.list.forEach(item => {
            const data = new Date(item.dt * 1000);
            const dataBezCzasu = data.toLocaleDateString('pl-PL'); // Usuwamy godzinę, zostawiamy tylko datę

            // Sprawdzamy, czy to już ten sam dzień
            if (dataBezCzasu !== currentDate) {
                currentDate = dataBezCzasu;
                const ikona = item.weather[0].icon;
                prognozy.push(`
                    <div class="prognoza-kafelek">
                        <p>${dataBezCzasu}</p>
                        <img src="https://openweathermap.org/img/wn/${ikona}@2x.png" alt="${item.weather[0].description}">
                        <p>${item.weather[0].description}</p>
                        <p>${item.main.temp}°C</p>
                    </div>
                `);
            }
        });

        // Jeśli mamy mniej niż 5 dni, dodajemy puste dni
        while (prognozy.length < 5) {
            prognozy.push('<div class="prognoza-kafelek"><p>Brak danych</p></div>');
        }

        // Dodajemy prognozę na 5 dni
        wynikDiv.innerHTML += `
            <div id="prognoza-5dni">
                <h2>Prognoza na 5 dni:</h2>
                <div class="prognoza-kafelki-container">
                    ${prognozy.slice(0, 5).join('')}
                </div>
            </div>
        `;
    }
}



pogodaButton.addEventListener('click', () => {
    const miasto = miastoInput.value.trim();
    if (!miasto) {
        wynikDiv.innerHTML = `<p>Proszę wpisać nazwę miasta!</p>`;
        return;
    }

    wynikDiv.innerHTML = `<p>Ładowanie danych...</p>`;
    aktualnaPogoda(miasto);
    pogoda5Dni(miasto);
});
