const mainSec = document.querySelector(".main");

const continentArr = [
  { continent: { name: "Asia", countries: [] } },
  { continent: { name: "Africa", countries: [] } },
  { continent: { name: "Europe", countries: [] } },
  { continent: { name: "Americas", countries: [] } },
  { continent: { name: "Oceania", countries: [] } },
];
const names = ["asia", "africa", "europe", "americas", "oceania"];

function continentNames() {
  names.forEach((name) => {
    makeButtons(name);
    getCountryData(name);
  });
}

function makeButtons(name) {
  const contiContainer = document.createElement("div");
  contiContainer.setAttribute(`id`, `${name}`);
  contiContainer.id = `${name}`;
  contiContainer.classList.add(`cont`);
  mainSec.appendChild(contiContainer);
  const btn = document.createElement("button");
  btn.innerText = `${name}`;
  contiContainer.appendChild(btn);
}

async function getCountryData(name) {
  try {
    const response = await axios.get(
      `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${name}`
    );

    const finalResponse = await response.data;

    // while (!finalResponse.done) {
    //   console.log("not done");
    // }
    // console.log(finalResponse);
    getCountNameNRegion(await finalResponse);
  } catch (e) {
    console.log(`error!!! ${e}`);
  }
}

async function getCountNameNRegion(data) {
  console.log(data);
  data.forEach((country) => {
    let countryCode = country.cca2;
    let countName = country.name.common;
    let region = country.region;
    newObj = {
      name: countName,
      region: region,
      country_code: countryCode,
    };
    pushCountries(newObj);
  });
}

function pushCountries(obj) {
  continentArr.forEach((el) => {
    if (obj.region === el.continent.name) {
      // console.log(obj);
      el.continent.countries.push(obj);
    }
  });
}
// createDropdown();

continentNames();
console.log(continentArr);
console.log(continentArr[0].continent.countries);
console.log(continentArr[0].continent.countries.length);

function createDropdown() {
  window.addEventListener("load", (e) => {
    const btnDiv = document.querySelectorAll(".cont");
    btnDiv.forEach((el) => {
      console.log(el);
      console.log(continentArr[0].continent.name);
      const select = document.createElement("select");
      el.appendChild(select);
      // populateOptions(el);
    });
  });
}

function populateOptions(el) {
  continentArr.forEach((e) => {
    const name = e.continent.name.toLocaleLowerCase();
    if (name === el.id) {
      console.log(name, el.id);
      const countries = e.continent.countries;
      console.log(countries.length);
      console.log(continentArr[0].continent.name);
    }
  });
}
