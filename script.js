const mainSec = document.querySelector(".main");

let continentArr = [
  { continent: { name: "Asia", countries: [] } },
  { continent: { name: "Africa", countries: [] } },
  { continent: { name: "Europe", countries: [] } },
  { continent: { name: "Americas", countries: [] } },
  { continent: { name: "Oceania", countries: [] } },
];

const names = ["asia", "africa", "europe", "americas", "oceania"];

async function continentNames() {
  mainSec.innerHTML = "";
  names.forEach((name) => {
    makeButtons(name);
  });
}
continentNames();

function makeButtons(name) {
  const contiContainer = document.createElement("div");
  contiContainer.setAttribute(`id`, `${name}`);
  contiContainer.id = `${name}`;
  contiContainer.classList.add(`cont`);
  mainSec.appendChild(contiContainer);
  const btn = document.createElement("div");
  btn.classList.add("continentBtn");
  btn.innerText = `${name}`;
  contiContainer.appendChild(btn);
  btn.addEventListener("click", () => {
    continentNames();
    clickContinentBtn(`${btn.innerText}`);
  });
}

async function getCountryData(name) {
  const response = await axios.get(
    `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${name}`
  );
  return response.data;
}
function clickContinentBtn(name) {
  getCountryData(name).then((data) => {
    getCountNameNRegion(data);
  });

  setTimeout(() => {
    makeDropdown(name);
  }, 500);
}

async function getCountNameNRegion(data) {
  for (let i = 0; i < data.length; i++) {
    let countryCode = data[i].cca2;
    let countName = data[i].name.common;
    let region = data[i].region;
    newObj = {
      name: countName,
      region: region,
      country_code: countryCode,
    };

    pushCountries(newObj);
  }
}

async function pushCountries(obj) {
  for (let el of continentArr) {
    if (obj.region === el.continent.name) {
      el.continent.countries.push(obj);
    }
  }
}

function makeDropdown(name) {
  const btnDiv = document.querySelector(`#${name}`);
  const select = document.createElement("select");
  select.classList.add(`${name}Select`);
  btnDiv.appendChild(select);

  populateOption(name);
}

function populateOption(name) {
  const contSelect = document.querySelector(`#${name}`);
  continentArr.forEach((e) => {
    const nameArr = e.continent.name.toLocaleLowerCase();
    if (nameArr === name) {
      const countries = e.continent.countries;
      countries.forEach((country) => {
        makeSelectBtns(country, contSelect);
      });
    }
  });
}

function makeSelectBtns(country, select) {
  const selectedSelect = document.querySelector(`.${select.id}Select`);
  const dropDownName = document.createElement("option");
  dropDownName.innerText = country.name;
  selectedSelect.appendChild(dropDownName);
}
