document.getElementById('submit-country').addEventListener('click', async function() {
    const countryName = document.getElementById('country-name').value.trim();

    const countryInfoSection = document.getElementById('country-info');
    const bordersSection = document.getElementById('bordering-countries');

    countryInfoSection.innerHTML = "";
    bordersSection.innerHTML = "";

    if (!countryName) {
        countryInfoSection.innerHTML = "<p style='color: red;'>Please enter a country name.</p>";
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);

        if (!response.ok) throw new Error();

        const countryData = await response.json();
        const country = countryData[0]; 

        countryInfoSection.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img class="flag" src="${country.flags.svg}" alt="Flag of ${country.name.common}">
        `;

        if (country.borders && country.borders.length > 0) {
            const borderCodes = country.borders.join(",");
            const bordersResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`);
            const bordersData = await bordersResponse.json();

            bordersSection.innerHTML = "<h3>Bordering Countries:</h3><ul class='border-list'>";
            bordersData.forEach(borderCountry => {
                bordersSection.innerHTML += `
                    <li class="border-country">
                        <p><strong>${borderCountry.name.common}</strong></p>
                        <img class="flag" src="${borderCountry.flags.svg}" alt="Flag of ${borderCountry.name.common}">
                    </li>
                `;
            });
            bordersSection.innerHTML += "</ul>"; //
        } else {
            bordersSection.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        countryInfoSection.innerHTML = "<p style='color: red;'>Invalid country.</p>";
    }
});
