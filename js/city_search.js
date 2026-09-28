import {changeState} from "./main.js";

const weatherCodeMap = {
    0: ["Clear Sky", "sun.png"],
    1: ["Mainly Clear", "sun.png"],
    2: ["Partly Cloudy", "cloudy.png"],
    3: ["Overcast", "overcast.png"],
    45: ["Fog", "fog.png"],
    48: ["Depositing Rime Fog", "fog.png"],
    51: ["Light Drizzle", "rain.png"],
    53: ["Moderate Drizzle", "rain.png"],
    55: ["Dense Drizzle", "rain.png"],
    56: ["Light Freezing Drizzle", "rain.png"],
    57: ["Dense Freezing Drizzle", "rain.png"],
    61: ["Slight Rain", "rain.png"],
    63: ["Moderate Rain", "rain.png"],
    65: ["Heavy Rain", "rain.png"],
    66: ["Light Freezing Rain", "rain.png"],
    67: ["Dense Freezing Rain", "rain.png"],
    71: ["Light Snow", "snow.png"],
    73: ["Moderate Snow", "snow.png"],
    75: ["Heavy Snow", "snow.png"],
    77: ["Snow Grains", "snow.png"],
    80: ["Slight Rain Showers", "rain.png"],
    81: ["Moderate Rain Showers", "rain.png"],
    82: ["Violent Rain Showers", "rain.png"],
    85: ["Slight Snow Showers", "snow.png"],
    86: ["Heavy Snow Showers", "snow.png"],
    95: ["Thunderstorm", "thunderstorm.png"],
    96: ["Thunderstorm With Slight Hail", "thunderstorm.png"],
    99: ["Thunderstorm With Heavy Hail", "thunderstorm.png"]
};

const response = await fetch("./cities.json");
const citiesData = await response.json();

const country_input = document.getElementById("country_search");
const country_results = document.getElementById("country_results");
const state_input = document.getElementById("state_search");
const state_results = document.getElementById("state_results");
const city_input = document.getElementById("city_search");
const city_results = document.getElementById("city_results");
const enter_city = document.getElementById("enter-city")


function resultHider(){
    requestAnimationFrame(resultHider);

    if(country_results.children.length === 0){
        country_results.style.borderWidth = "0px";
    }else{
        country_results.style.borderWidth = "3px";
    }

    if(state_results.children.length === 0){
        state_results.style.borderWidth = "0px";
    }else{
        state_results.style.borderWidth = "3px";
    }

    if(city_results.children.length === 0){
        city_results.style.borderWidth = "0px";
    }else{
        city_results.style.borderWidth = "3px";
    }
}

resultHider();


function Normalize(text){
    return text
        .toLowerCase()
        .replace(/ł/g, "l")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function FuzzyMatch(query, text){
    query = Normalize(query);
    text = Normalize(text);

    const counts = {};

    for(const letter of text){
        counts[letter] = (counts[letter] || 0) + 1;
    }

    for(const letter of query){
        if(!counts[letter]){
            return false;
        }

        counts[letter]--;
    }

    return true;
}

city_input.addEventListener("input", ()=>{
    const query = city_input.value.trim();
    let matches = []

    city_results.innerHTML = "";

    if(!query){
        return;
    }

    if(state_input.value.trim() == "" && country_input.value.trim() == ""){
        for(const country of Object.values(citiesData)){
            for(const state of Object.values(country)){
                for(const city of Object.keys(state)){
                    const match = FuzzyMatch(query, city);

                    if(match){
                        matches.push(city);
                    }
                }
            }
        }
    }

    else if(state_input.value.trim() != "" && country_input.value.trim() == ""){
        for(const country of Object.values(citiesData)){
            for(const [state_name, state] of Object.entries(country)){
                if(Normalize(state_input.value.trim()) == Normalize(state_name)){
                    for(const city of Object.keys(state)){
                        const match = FuzzyMatch(query, city);

                        if(match){
                            matches.push(city);
                        }
                    }
                }
            }
        }
    }

    else if(state_input.value.trim() == "" && country_input.value.trim() != ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            if(Normalize(country_input.value.trim()) == Normalize(country_name)){
                for(const state of Object.values(country)){
                    for(const city of Object.keys(state)){
                        const match = FuzzyMatch(query, city);

                        if(match){
                            matches.push(city);
                        }
                    }
                }
            }
        }
    }

    else if(state_input.value.trim() != "" && country_input.value.trim() != ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            if(Normalize(country_input.value.trim()) == Normalize(country_name)){
                for(const [state_name, state] of Object.entries(country)){
                    if(Normalize(state_input.value.trim()) == Normalize(state_name)){
                        for(const city of Object.keys(state)){
                            const match = FuzzyMatch(query, city);

                            if(match){
                                matches.push(city);
                            }
                        }
                    }
                }
            }
        }
    }

    matches.forEach(city => {
        const li = document.createElement("li");

        li.textContent = city;

        li.addEventListener("click", ()=>{
            city_input.value = city;
            city_results.innerHTML = "";
        })

        city_results.appendChild(li);
    })
})

state_input.addEventListener("input", ()=>{
    const query = state_input.value.trim();
    let matches = []

    state_results.innerHTML = "";

    if(!query){
        return;
    }

    if(city_input.value.trim() == "" && country_input.value.trim() == ""){
        for(const country of Object.values(citiesData)){
            for(const state of Object.keys(country)){
                const match = FuzzyMatch(query, state);

                if(match){
                    matches.push(state);
                }
            }
        }
    }

    else if(city_input.value.trim() != "" && country_input.value.trim() == ""){
        for(const country of Object.values(citiesData)){
            for(const [state_name, state] of Object.entries(country)){
                for(const city of Object.keys(state)){
                    if(Normalize(city_input.value.trim()) == Normalize(city)){
                        const match = FuzzyMatch(query, state_name);

                        if(match){
                            matches.push(state_name);
                        }
                    }
                }
            }
        }
    }

    else if(city_input.value.trim() == "" && country_input.value.trim() != ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            if(Normalize(country_input.value.trim()) == Normalize(country_name)){
                for(const state of Object.keys(country)){
                    const match = FuzzyMatch(query, state);

                    if(match){
                        matches.push(state);
                    }
                }
            }
        }
    }

    else if(city_input.value.trim() != "" && country_input.value.trim() != ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            if(Normalize(country_input.value.trim()) == Normalize(country_name)){
                for(const [state_name, state] of Object.entries(country)){
                    for(const city of Object.keys(state)){
                        if(Normalize(city_input.value.trim()) == Normalize(city)){
                            const match = FuzzyMatch(query, state_name);

                            if(match){
                                matches.push(state_name);
                            }
                        }
                    }
                }
            }
        }
    }

    matches.forEach(state => {
        const li = document.createElement("li");

        li.textContent = state;

        li.addEventListener("click", ()=>{
            state_input.value = state;
            state_results.innerHTML = "";
        })

        state_results.appendChild(li);
    })
})

country_input.addEventListener("input", ()=>{
    const query = country_input.value.trim();
    let matches = []

    country_results.innerHTML = "";

    if(!query){
        return;
    }

    if(city_input.value.trim() == "" && state_input.value.trim() == ""){
        for(const country of Object.keys(citiesData)){
            const match = FuzzyMatch(query, country);

            if(match){
                matches.push(country);
            }
        }
    }
    
    else if(city_input.value.trim() != "" && state_input.value.trim() == ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            for(const state of Object.values(country)){
                for(const city of Object.keys(state)){
                    if(Normalize(city_input.value.trim()) == Normalize(city)){
                        const match = FuzzyMatch(query, country_name);

                        if(match){
                            matches.push(country_name);
                        }
                    }
                }
            }
        }
    }

    else if(city_input.value.trim() == "" && state_input.value.trim() != ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            for(const state of Object.keys(country)){
                if(Normalize(state_input.value.trim()) == Normalize(state)){
                    const match = FuzzyMatch(query, country_name);

                    if(match){
                        matches.push(country_name);
                    }
                }
            }
        }
    }

    else if(city_input.value.trim() != "" && state_input.value.trim() != ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            for(const [state_name, state] of Object.entries(country)){
                if(Normalize(state_input.value.trim()) == Normalize(state_name)){
                    for(const city of Object.keys(state)){
                        if(Normalize(city_input.value.trim()) == Normalize(city)){
                            const match = FuzzyMatch(query, country_name);

                            if(match){
                                matches.push(country_name);
                            }
                        }
                    }
                }
            }
        }
    }

    matches.forEach(country => {
        const li = document.createElement("li");

        li.textContent = country;

        li.addEventListener("click", ()=>{
            country_input.value = country;
            country_results.innerHTML = "";
        })

        country_results.appendChild(li);
    })
})

enter_city.addEventListener("click", ()=>{
    let latitude;
    let longitude;

    if(state_input.value.trim() == "" && country_input.value.trim() == "" && city_input != ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            for(const [state_name, state] of Object.entries(country)){
                for(const city of Object.keys(state)){
                    if(Normalize(city_input.value.trim()) == Normalize(city)){
                        ({latitude, longitude} = citiesData[country_name][state_name][city]);
                    }
                }
            }
        }
    }

    else if(state_input.value.trim() != "" && country_input.value.trim() == "" && city_input != ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            for(const [state_name, state] of Object.entries(country)){
                if(Normalize(state_input.value.trim()) == Normalize(state_name)){
                    for(const city of Object.keys(state)){
                        if(Normalize(city_input.value.trim()) == Normalize(city)){
                            ({latitude, longitude} = citiesData[country_name][state_name][city]);
                        }
                    }  
                }
            }
        }
    }

    else if(state_input.value.trim() == "" && country_input.value.trim() != "" && city_input != ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            if(Normalize(country_input.value.trim()) == Normalize(country_name)){
                for(const [state_name, state] of Object.entries(country)){
                    for(const city of Object.keys(state)){
                        if(Normalize(city_input.value.trim()) == Normalize(city)){
                            ({latitude, longitude} = citiesData[country_name][state_name][city]);
                        }
                    }  
                }
            }
        }
    }

    else if(state_input.value.trim() != "" && country_input.value.trim() != "" && city_input != ""){
        for(const [country_name, country] of Object.entries(citiesData)){
            if(Normalize(country_input.value.trim()) == Normalize(country_name)){
                for(const [state_name, state] of Object.entries(country)){
                    if(Normalize(state_input.value.trim()) == Normalize(state_name)){
                        for(const city of Object.keys(state)){
                            if(Normalize(city_input.value.trim()) == Normalize(city)){
                                ({latitude, longitude} = citiesData[country_name][state_name][city]);;
                            }
                        }  
                    }
                }
            }
        }
    }
    
    const weather_url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    getWeather(weather_url);
})

async function getWeather(weather_url){
    let temperature;
    let wind_speed;
    let weather_condition, weather_image;
    if(false){
        const response = await fetch(weather_url);
        const data = await response.json();
        console.log(data);
        let temperature = data.current_weather.temperature;
        let wind_speed = data.current_weather.windspeed;
        let [weather_condition, weather_image] = weatherCodeMap[data.current_weather.weathercode];
    }
    else{
        temperature = 10;
        wind_speed = 2;
        [weather_condition, weather_image] = weatherCodeMap[0];
    }

    document.getElementById("temperature").innerHTML = `Temperature: ${temperature}°`;
    document.getElementById("wind-speed").innerHTML = `Wind speed: ${wind_speed}km/h`;
    document.getElementById("weather").innerHTML = `Weather: ${weather_condition}`;

    changeState("fishing");
}