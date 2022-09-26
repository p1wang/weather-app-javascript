// Elements
const weatherIcon = document.getElementById("weather-icon");
const city = document.getElementById("city");
const condition = document.getElementById("condition");
const temperatureC = document.getElementById("temperature-c");
const input = document.getElementById("input");
const form = document.querySelector(".search-form");
const list = document.querySelector(".auto-complete");
const weatherCard = document.querySelector(".weather-card");

// On page load
window.addEventListener("load", async () => {
  const data = await getWeatherData("Toronto");
  populateWeatherData(data);
});

// Event listeners
form.addEventListener("submit", handleSearch);
input.addEventListener("keyup", autoCompleteData);
list.addEventListener("click", handleSearch);

// Api
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "95e5b48b7bmshb16dd86a5db12c0p10ce38jsn4cf719cea1aa",
    "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
  },
};

// Functions
function populateWeatherData(data) {
  // current
  weatherIcon.src = "https://" + data.current.condition.icon.substring(2);
  city.innerText = data.location.name;
  condition.innerText = data.current.condition.text;
  temperatureC.innerHTML = `${data.current.temp_c} <span>&#8451;</span`;

  //  forecast
  data.forecast.forecastday.forEach((item) => {
    const element = document.createElement("div");
    element.classList.add("forecast__day");
    element.innerHTML = `<span class="forecast__date">${item.date.slice(
      5
    )}</span>
    <img src=${
      item.day.condition.icon
    } width="32px" height="32px" class="forecast__icon"  alt="Weather conditon icon"/>
    <span class="forecast__low">${item.day.mintemp_c} &#8451;</span>
    <span class="forecast__bar">-</span>
    <span class="forecast__high">${item.day.maxtemp_c} &#8451;</span>`;
    weatherCard.appendChild(element);
  });
}

function populateAutoComplete(data) {
  list.innerHTML = "";
  data.forEach((item) => {
    let li = document.createElement("li");
    li.innerText = item.name;
    li.classList.add("auto-complete-item");
    list.appendChild(li);
    li.onclick = () => {
      input.value = li.innerText;
    };
  });
}

async function getWeatherData(city) {
  try {
    const response = await fetch(
      `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=3`,
      options
    );

    if (!response.ok) throw new Error("No matching location found.");

    const data = await response.json();

    console.log(data.forecast.forecastday);

    return data;
  } catch (error) {
    reset();
    alert(error.message);
  }
}

async function handleSearch(e) {
  e.preventDefault();

  const data = await getWeatherData(input.value);

  document
    .querySelectorAll(".forecast__day")
    .forEach((element) => element.remove());

  console.log(data);

  populateWeatherData(data);

  reset();
}

async function autoCompleteData() {
  try {
    const response = await fetch(
      `https://weatherapi-com.p.rapidapi.com/search.json?q=${input.value}`,
      options
    );

    const data = await response.json();

    populateAutoComplete(data);
  } catch (error) {
    console.log(error);
  }
}

function reset() {
  list.innerHTML = "";
  input.value = "";
}
