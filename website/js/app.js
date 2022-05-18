const apiKey = 'aecf70c5c623d815ae07543773aaacb1&units=metric' //temporary API Key
const date = new Date();
const dateToday = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

window.addEventListener('DOMContentLoaded', init);

let i = 0

function init() {
    const closeButtons = document.querySelectorAll('.close-btn');
    const newEntryButton = document.getElementById('add-entry');
    const entryForm = document.getElementById('new-entry');
    const generateButton = document.getElementById('generate');
    const errorBox = document.getElementById('error-box');
    const entryHolder = document.getElementById('entryHolder');
    const backdrop = document.querySelector('.backdrop');

    const placeholders = {
        date: document.getElementById('date'),
        location: document.getElementById('location'),
        temp: document.getElementById('temp'),
        condition: document.getElementById('condition'),
        content: document.getElementById('content')
    }

    generateButton.addEventListener('click', function () {
        if (isFormValid(entryForm)) {
            const zip = entryForm.querySelector('#zip').value;
            const feelings = entryForm.querySelector('#feelings').value;

            fadeOut(errorBox);
            fadeOut(entryHolder);
            fadeOut(newEntryButton);
            fadeIn(backdrop);

            const coordURL = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},AU&appid=${apiKey}`;

            fetchCoordinates(coordURL).then((resp) => { //fetch coordinates for zipcode provided by user then use them to get weather data.
                const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${resp.lat}&lon=${resp.lon}&appid=${apiKey}`;
                return fetchWeatherData(weatherURL);

            }).then(resp => {
                const data = {
                    ...resp,
                    feelings,
                    dateToday
                }
                postData('/new-entry', data);

            }).then(() => {
                return getData('/all');

            }).then(resp => {
                updateUI(placeholders, resp);

            }).then(() => {
                newEntryButton.dispatchEvent(new Event('click'));
                fadeOut(backdrop).then(fadeIn(entryHolder));

            }).catch(error => {
                fadeIn(errorBox).then(() => {
                    errorBox.querySelector('.error').innerHTML = `Sorry, something went wrong!: ${error}`;
                });
                fadeOut(backdrop);
            });
        }
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const parent = this.closest('.container');
            if (parent.classList.contains('message')) {
                fadeInOut(parent).then(() => {
                    parent.remove();
                })
            } else {
                fadeInOut(parent);
            }
        });
    });

    newEntryButton.addEventListener('click', function () {
        fadeInOut(entryForm).then(() => {
            if (entryForm.classList.contains('hidden')) {
                this.classList.remove('cancel')
                this.classList.remove('hidden');
                this.querySelector('.text').innerHTML = 'New Entry';
            } else {
                this.classList.add('cancel');
                this.querySelector('.text').innerHTML = 'Cancel';
            }
        });
    });
}

const getData = async url => {
    try {
        const response = await fetch(url)
        return (await response.json());
    } catch (error) {
        console.error(`[GETDATA] ${error}`);
        throw error;
    }
}

const postData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        });
        console.log(await response.text());
    } catch (error) {
        console.error(`[POST catch] ${error}`);
        throw error;
    }
}

const fetchCoordinates = async url => {
    try {
        const response = await fetch(url);
        return (await response.json());
    }
    catch (error) {
        console.error(`[Fetch Error] ${error}`);
        throw error;
    }
}

const fetchWeatherData = async url => {

    try {
        const response = await fetch(url);
        const data = await response.json();

        return {
            temp: data.main.temp,
            weatherDes: data.weather[0].main,
            weatherID: data.weather[0].id,
            location: data.name
        }
    }
    catch (error) {
        console.error(`[Fetch Error] ${error}`);
        throw error;
    }

}

const updateUI = (placeholders, data) => {
    placeholders.date.innerHTML = data.dateToday;
    placeholders.location.innerHTML = data.location;
    placeholders.temp.innerHTML = parseInt(data.temp);
    placeholders.content.innerHTML = data.feelings;
    placeholders.condition.innerHTML = data.weatherDes;
    pickWeatherIcon(data.weatherID);
}

const pickWeatherIcon = code => {
    const icons = {
        clear: document.querySelector('.clear_icon'),
        cloudy: document.querySelector('.cloudy_icon'),
        p_cloudy: document.querySelector('.p_cloudy_icon'),
        rainy: document.querySelector('.rainy_icon'),
        snowy: document.querySelector('.snowy_icon')
    }

    for (const icon in icons) {
        icons[icon].classList.remove('active');
    }

    if (code >= 200 && code < 600) {
        icons.rainy.classList.add('active');
    } else if (code >= 600 && code < 700) {
        icons.snowy.classList.add('active');
    } else if (code >= 700 && code < 800) {
        icons.cloudy.classList.add('active');
    } else if (code == 800) {
        icons.clear.classList.add('active');
    } else if (code == 801) {
        icons.p_cloudy.classList.add('active');
    } else if (code > 801 && code < 900) {
        icons.cloudy.classList.add('active');
    }
}

const fadeInOut = element => {
    if (element.classList.contains('hidden')) {
        element.classList.add('transition');
        element.clientHeight;
        element.classList.remove('hidden');
    } else {
        element.classList.add('transition');
        element.classList.add('hidden');
    }
    return handleTransEnd(element);
}

const fadeIn = element => {
    if (element.classList.contains('hidden')) {
        element.classList.add('transition');
        element.clientHeight;
        element.classList.remove('hidden');
        return handleTransEnd(element);
    }
}

const fadeOut = element => {
    if (!element.classList.contains('hidden')) {
        element.classList.add('transition');
        element.classList.add('hidden');
        return handleTransEnd(element);
    }
}

const handleTransEnd = element => {
    return new Promise((resolve) => {
        const callback = (e) => {
            e.stopPropagation();
            element.classList.remove('transition');
            resolve(callback);
        }
        element.addEventListener('transitionend', callback);
    }).then((callback) => {
        element.removeEventListener('transitionend', callback);
    });
}