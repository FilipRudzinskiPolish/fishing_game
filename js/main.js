const cities = [
    "Wrocław",
    "Warszawa",
    "Łódź",
    "Poznań",
    "Kraków",
    "Gdańsk",
    "Szczecin"
];

const input = document.getElementById("search");
const results = document.getElementById("results");

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

input.addEventListener("input", ()=>{
    const query = input.value.trim();

    results.innerHTML = "";

    if(!query){
        return;
    }

    const matches = cities.filter(city => FuzzyMatch(query, city));

    matches.forEach(city => {
        const li = document.createElement("li");

        li.textContent = city;

        li.addEventListener("click", ()=>{
            input.value = city;
            results.innerHTML = "";
        })

        results.appendChild(li);
    })
})