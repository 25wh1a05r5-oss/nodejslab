const API_KEY = "17a7e1cc3e0a9e0f9304bd814e97e23a";

const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const messageBox = document.getElementById("message");

let weatherChart = null; // will hold our chart, so we can redraw it later

// This runs when the user clicks the "Get Weather" button
getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    messageBox.textContent = "Please type a city name first.";
    return;
  }

  messageBox.textContent = "Loading...";
  getWeatherData(city); // call our async function below
});

// ---- ASYNC FUNCTION: fetch forecast data and draw the graph ----
async function getWeatherData(city) {
  try {
    // Build the API URL. This endpoint gives a 5-day forecast,
    // with one data point every 3 hours -- perfect for a graph.
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

    // "await" pauses here until the data actually arrives from the internet
    const response = await fetch(url);
    const data = await response.json();

    // If the city name was wrong, OpenWeatherMap sends an error message
    if (data.cod !== "200") {
      messageBox.textContent = "City not found. Please check the spelling.";
      return;
    }

    messageBox.textContent = ""; // clear any old message

    // Pull out just the pieces we need for the graph:
    // - times (labels for the X axis)
    // - temperatures (values for the Y axis)
    const times = data.list.map((entry) => entry.dt_txt.slice(5, 16)); // e.g. "08-15 09:00"
    const temps = data.list.map((entry) => entry.main.temp);

    drawGraph(times, temps, city);

  } catch (error) {
    // This runs if the internet request itself failed (no wifi, wrong key, etc.)
    console.log("Something went wrong:", error);
    messageBox.textContent = "Something went wrong. Check your internet or API key.";
  }
}

// ---- Draws (or redraws) the line graph using Chart.js ----
function drawGraph(labels, temperatures, city) {
  const ctx = document.getElementById("weatherChart").getContext("2d");

  // If a chart already exists from a previous search, remove it first
  if (weatherChart !== null) {
    weatherChart.destroy();
  }

  weatherChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels, // X axis: date/time
      datasets: [
        {
          label: `Temperature in ${city} (°C)`,
          data: temperatures, // Y axis: temperature values
          borderColor: "blue",
          fill: false,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Date / Time" } },
        y: { title: { display: true, text: "Temperature (°C)" } },
      },
    },
  });
}