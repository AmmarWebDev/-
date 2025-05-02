"use strict";

/* Default User Info */
const userDefaultCity = 'Alexandria';
const today = new Date();
const offsetDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60_000));

const day = String(offsetDate.getDate()).padStart(2, '0');
const month = String(offsetDate.getMonth() + 1).padStart(2, '0');
const year = offsetDate.getFullYear();

const formattedUserDate = `${year}-${month}-${day}`;
const formattedAPIDate = `${day}-${month}-${year}`;


/* User Info (if the defaults ones are changed) */
const user = {
  city: userDefaultCity,
  date: formattedUserDate,
  dateForAPI: formattedAPIDate,
}


/* DOM Constants */
const timingsWrapper = document.querySelector('.timings-wrapper');

const selectCityMenu = document.querySelector('.options #city');
selectCityMenu.value = userDefaultCity;
selectCityMenu.addEventListener('change', () => {
  changeCity(selectCityMenu.value);
});

const selectDayInput = document.querySelector('.options #day');
selectDayInput.value = formattedUserDate;
selectDayInput.addEventListener('change', () => {
  changeDate(selectDayInput.value);
});

const displayedCity = document.querySelector('.info .city');
displayedCity.innerHTML = userDefaultCity;

const displayedDate = document.querySelector('.info .date');
displayedDate.innerHTML = formattedUserDate;


/* General Info */
const cities = new Map();

cities.set('Cairo', { city: 'Cairo', country: 'Egypt', method: 5 });
cities.set('Alexandria', { city: 'Alexandria', country: 'Egypt', method: 5 });
cities.set('Mecca', { city: 'Mecca', country: 'KSA', method: 4 });
cities.set('Riyadh', { city: 'Riyadh', country: 'KSA', method: 4 });


/* Functions */
function changeCity(city) {
  displayedCity.innerHTML = city;
  user.city = city;
  showPrayersTimings();
}

function changeDate(date) {
  displayedDate.innerHTML = date;
  user.date = date;
  user.dateForAPI = date.split('-').reverse().join('-');
  showPrayersTimings();
}


/* Get The API */
async function showPrayersTimings() {
  try {
    // Gets Data From API
    const API = `https://api.aladhan.com/v1/timingsByCity/${user.dateForAPI}?city=${user.city}&country=${cities.get(user.city).country}&method=${cities.get(user.city).method}`;
    const response = await axios.get(API);
    const data = response.data.data;

    /* DOM Creation */
    // resets the old timings
    timingsWrapper.innerHTML = '';

    // re-create the timings
    const prayerNames = [
      {en: 'Fajr', ar: 'الفجر'},
      {en: 'Sunrise', ar: 'الشروق'},
      {en: 'Dhuhr', ar: 'الظهر'},
      {en: 'Asr', ar: 'العصر'},
      {en: 'Maghrib', ar: 'المغرب'},
      {en: 'Isha', ar: 'العشاء'}
    ];

    prayerNames.forEach(element => {
      timingsWrapper.innerHTML += `
        <div class="prayer-box">
          <h4 class="title">${element.ar}</h4>
          <p class="time">${data.timings[element.en]}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error(error);

    const errorMsg = document.createElement('span');
    errorMsg.innerHTML = 'حدث خطأ في محاولة طلب البيانات';
    errorMsg.className = 'error-message';

    timingsWrapper.appendChild(errorMsg);
  }
}

showPrayersTimings();
