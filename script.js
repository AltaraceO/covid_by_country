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
  //   contiContainer.setAttribute(`id`, `${name}`);
  //   contiContainer.id = `${name}`;
  //   contiContainer.classList.add(`cont`);
  mainSec.appendChild(contiContainer);
  const btn = document.createElement("button");
  //   btn.innerText = `${name}`;
  contiContainer.appendChild(btn);
}

async function getCountryData(name) {
  try {
    const response = await axios.get(
      `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${name}`
    );
    getCountNameNRegion(response.data);
  } catch (e) {
    console.log(`error!!! ${e}`);
  }
}

function getCountNameNRegion(data) {
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
      el.continent.countries.push(obj);
    }
  });
}
createDropdown();

continentNames();
console.log(continentArr);

function makeButtons(name) {
  const contiContainer = document.createElement("div");
  contiContainer.classList.add(`${name}`);
  contiContainer.classList.add(`cont`);
  mainSec.appendChild(contiContainer);
  const btn = document.createElement("button");
  btn.innerText = `${name}`;
  contiContainer.appendChild(btn);
}

function createDropdown() {
  window.addEventListener("load", (e) => {
    const btns = document.querySelectorAll(".cont");
    btns.forEach((e) => {
      console.log(e);
    });
  });
}
