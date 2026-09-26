import json

admin1_lookup = {}

user_input = int(input("1 to create JSON, 2 to view JSON: "))

if user_input == 1:
    with open("admin1CodesASCII.txt", "r", encoding="utf-8") as file:
        for line in file:
            parts = line.strip().split("\t")

            if len(parts) >= 2:
                admin1_lookup[parts[0]] = parts[1]

    cities_data = {}

    with open("cities5000.txt", "r", encoding="utf-8") as file:
        for line in file:
            parts = line.strip().split("\t")

            city = parts[1]
            latitude = float(parts[4])
            longitude = float(parts[5])
            country = parts[8]
            admin1_code = parts[10]

            state = admin1_lookup.get(f"{country}.{admin1_code}", admin1_code or "Unknown")

            if country not in cities_data:
                cities_data[country] = {}

            if state not in cities_data[country]:
                cities_data[country][state] = {}

            cities_data[country][state][city] = {
                "longitude": longitude,
                "latitude": latitude
            }

    with open("cities.json", "w", encoding="utf-8") as file:
        json.dump(cities_data, file, ensure_ascii=False, indent=4)

    print(f"Saved {sum(len(state) for country in cities_data.values() for state in country.values()):,} cities")

if user_input == 2:
    with open("cities.json", "r", encoding="utf-8") as file:
        data = json.load(file)
        
        print(data["PL"])