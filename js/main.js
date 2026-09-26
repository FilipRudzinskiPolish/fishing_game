const response = await fetch("./cities.json");
const citiesData = await response.json();

const country_input = document.getElementById("country_search");
const country_results = document.getElementById("country_results");
const state_input = document.getElementById("state_search");
const state_results = document.getElementById("state_results");
const city_input = document.getElementById("city_search");
const city_results = document.getElementById("city_results");

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