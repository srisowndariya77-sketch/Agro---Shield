// ==================================
// AGRO SHIELD - JAVASCRIPT
// ==================================

console.log("Welcome to Agro Shield!");


// 1. Welcome Message

function showMessage() {
    alert("Welcome to Agro Shield - Smart Farming Support!");
}


// 2. Weather Precautions

function showPrecautions() {

    const crop = document.getElementById("crop").value;
    const result = document.getElementById("weather-result");

    let precautions = "";

    if (crop === "rice") {

        precautions = `
            <h3>Rice Crop Precautions</h3>
            <p>1. Ensure proper drainage in the field.</p>
            <p>2. Monitor water levels regularly.</p>
            <p>3. Follow local agricultural advisories.</p>
        `;

    } else if (crop === "cotton") {

        precautions = `
            <h3>Cotton Crop Precautions</h3>
            <p>1. Avoid water stagnation.</p>
            <p>2. Check field drainage systems.</p>
            <p>3. Monitor crop conditions regularly.</p>
        `;

    } else if (crop === "tomato") {

        precautions = `
            <h3>Tomato Crop Precautions</h3>
            <p>1. Ensure proper drainage.</p>
            <p>2. Monitor plants for disease symptoms.</p>
            <p>3. Follow local agricultural advisories.</p>
        `;

    } else if (crop === "banana") {

        precautions = `
            <h3>Banana Crop Precautions</h3>
            <p>1. Ensure proper drainage.</p>
            <p>2. Monitor plants during strong winds.</p>
            <p>3. Follow local agricultural advisories.</p>
        `;
    }

    result.innerHTML = precautions;
}


// 3. Plant Health Guidance

function submitSymptoms() {

    const symptoms = document
        .getElementById("symptoms")
        .value
        .trim()
        .toLowerCase();

    const result = document.getElementById("plant-result");

    if (symptoms === "") {
        result.textContent = "Please enter plant symptoms.";
        return;
    }

    let guidance = "";

    if (symptoms.includes("yellow")) {

        guidance = `
            <h3>Yellow Leaves Detected</h3>
            <p>Possible causes include nutrient imbalance, water stress or disease.</p>
            <p>Check soil moisture and observe whether symptoms spread.</p>
        `;

    } else if (
        symptoms.includes("brown") ||
        symptoms.includes("spots")
    ) {

        guidance = `
            <h3>Brown Spots Detected</h3>
            <p>Possible causes include leaf infection or environmental stress.</p>
            <p>Observe affected leaves and avoid unnecessary leaf wetting.</p>
        `;

    } else if (
        symptoms.includes("wilting") ||
        symptoms.includes("dry")
    ) {

        guidance = `
            <h3>Wilting Symptoms Detected</h3>
            <p>Possible causes include water stress, root problems or disease.</p>
            <p>Check soil moisture and inspect the plant condition.</p>
        `;

    } else if (
        symptoms.includes("holes") ||
        symptoms.includes("insects")
    ) {

        guidance = `
            <h3>Possible Pest Damage</h3>
            <p>Possible cause: Insect activity.</p>
            <p>Inspect both sides of leaves and record the affected area.</p>
        `;

    } else {

        guidance = `
            <h3>Symptoms Recorded</h3>
            <p>More information is required to understand the plant condition.</p>
            <p>Please consult an agricultural specialist.</p>
        `;
    }

    result.innerHTML = `
        ${guidance}

        <div class="rain-safe">
            <p><b>Agro Shield Recommendation:</b></p>
            <p>This is preliminary educational guidance, not an AI diagnosis.</p>
            <p>Consult an agricultural specialist before taking treatment decisions.</p>
        </div>
    `;
}


// 4. Live Weather and 7-Day Forecast

async function getWeather() {

    const city = document.getElementById("location").value.trim();
    const result = document.getElementById("live-weather-result");

    if (city === "") {
        result.textContent = "Please enter your city name.";
        return;
    }

    result.textContent = "Loading weather forecast...";

    try {

        // Find City Coordinates

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("City search failed");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            result.textContent = "City not found. Try another city.";
            return;
        }

        const place = geoData.results[0];


        // Fetch Weather Data

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&forecast_days=7&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Weather data unavailable");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;
        const daily = weatherData.daily;

        if (!current || !daily || !daily.time) {
            throw new Error("Incomplete weather data");
        }


        // Calculate Maximum Rain Probability

        const rainValues = daily.precipitation_probability_max.filter(
            value => value !== null
        );

        const maxRainProbability = rainValues.length > 0
            ? Math.max(...rainValues)
            : 0;


        // Heavy Rain Probability Alert

        let rainAlert = "";

        if (maxRainProbability >= 60) {

            rainAlert = `
                <div class="rain-alert">
                    <h3>High Rain Probability Alert!</h3>
                    <p>High chance of rainfall in the coming days.</p>
                    <p>Maximum Rain Probability: ${maxRainProbability}%</p>
                    <p>Check field drainage and follow local agricultural advisories.</p>
                </div>
            `;

        } else {

            rainAlert = `
                <div class="rain-safe">
                    <p>No high-rain-probability alert in the current 7-day forecast.</p>
                </div>
            `;
        }


        // Crop-Specific Recommendations

        const selectedCrop = document.getElementById("crop").value;

        let cropAdvice = "";

        if (selectedCrop === "rice") {

            cropAdvice = maxRainProbability >= 60
                ? "Rice: Monitor water levels and maintain proper drainage."
                : "Rice: Monitor water levels and follow regular field management practices.";

        } else if (selectedCrop === "cotton") {

            cropAdvice = maxRainProbability >= 60
                ? "Cotton: Prevent water stagnation and check field drainage."
                : "Cotton: Monitor crop growth and inspect the field regularly.";

        } else if (selectedCrop === "tomato") {

            cropAdvice = maxRainProbability >= 60
                ? "Tomato: Ensure proper drainage and monitor plants for disease symptoms."
                : "Tomato: Monitor plant health and maintain proper field conditions.";

        } else if (selectedCrop === "banana") {

            cropAdvice = maxRainProbability >= 60
                ? "Banana: Check drainage and monitor plants during strong winds."
                : "Banana: Monitor plant stability and maintain proper drainage.";
        }


        // Seven-Day Forecast

        let forecastHTML = "<h3>7-Day Weather Forecast</h3>";

        for (let i = 0; i < daily.time.length; i++) {

            forecastHTML += `
                <div class="forecast-card">

                    <p><b>${daily.time[i]}</b></p>

                    <p>Maximum Temperature:
                    ${daily.temperature_2m_max[i]} °C</p>

                    <p>Minimum Temperature:
                    ${daily.temperature_2m_min[i]} °C</p>

                    <p>Rain Probability:
                    ${daily.precipitation_probability_max[i] ?? "N/A"}%</p>

                    <p>Expected Rainfall:
                    ${daily.precipitation_sum[i]} mm</p>

                </div>
            `;
        }


        // Weather Dashboard

        result.innerHTML = `

            <h3>Current Weather - ${place.name}</h3>

            <div class="weather-dashboard">

                <div class="weather-card">
                    <h4>Temperature</h4>
                    <p>${current.temperature_2m} °C</p>
                </div>

                <div class="weather-card">
                    <h4>Humidity</h4>
                    <p>${current.relative_humidity_2m}%</p>
                </div>

                <div class="weather-card">
                    <h4>Rainfall</h4>
                    <p>${current.precipitation} mm</p>
                </div>

                <div class="weather-card">
                    <h4>Wind Speed</h4>
                    <p>${current.wind_speed_10m} km/h</p>
                </div>

            </div>

            ${rainAlert}

            <h3>Crop Protection Recommendations</h3>

            <p>${cropAdvice}</p>

            ${forecastHTML}

            <p>
                <small>
                    Weather data: Open-Meteo.
                    Forecast values are estimates.
                    This demo alert is not an official weather warning.
                </small>
            </p>

        `;

    }

    catch (error) {

        result.textContent =
            "Unable to fetch weather. Please check your internet connection.";

        console.error("Weather Error:", error);
    }
}


// 5. Farmer Support Request

function requestSupport() {

    const name = document.getElementById("farmer-name").value.trim();
    const crop = document.getElementById("farmer-crop").value;
    const issue = document.getElementById("farmer-issue").value.trim();

    const result = document.getElementById("support-result");

    if (name === "" || crop === "" || issue === "") {

        result.textContent = "Please fill in all the details.";
        return;
    }

    result.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Help Request Prepared Successfully!";

    const nameInfo = document.createElement("p");
    nameInfo.textContent = "Farmer Name: " + name;

    const cropInfo = document.createElement("p");
    cropInfo.textContent = "Selected Crop: " + crop;

    const issueInfo = document.createElement("p");
    issueInfo.textContent = "Problem: " + issue;

    const note = document.createElement("p");

    note.textContent =
        "Your request summary is ready. Please share it with an agricultural specialist for assistance.";

    result.append(
        heading,
        nameInfo,
        cropInfo,
        issueInfo,
        note
    );
}


    

    