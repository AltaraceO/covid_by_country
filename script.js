const mainSec = document.querySelector(".main");
const proxi = "https://intense-mesa-62220.herokuapp.com/";
const countryInfo = "https://restcountries.herokuapp.com/api/v1/region/";
const covidInfo = "https://corona-api.com/countries";

let continentArr = [
  { continent: { name: "Asia", countries: [] } },
  { continent: { name: "Africa", countries: [] } },
  { continent: { name: "Europe", countries: [] } },
  { continent: { name: "Americas", countries: [] } },
  { continent: { name: "Oceania", countries: [] } },
];

const covidArr = [];

const names = ["asia", "africa", "europe", "americas", "oceania"];

async function continentNames() {
  mainSec.innerHTML = "";
  // names.forEach((name) => {
  //   makeButtons(name);
  // });
  for (let i = 0; i < names.length; i++) {
    makeButtons(names[i], i);
  }
}
continentNames();

function makeButtons(name, idx) {
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
    arrangeContinentCovidStat(idx);
  });
}

async function getCountryData(name) {
  const response = await axios.get(`${proxi}${countryInfo}${name}`);
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
  const contSelectSelect = document.querySelector(`.${name}Select`);
  contSelectSelect.innerHTML = "";

  continentArr.forEach((e) => {
    const nameArr = e.continent.name.toLocaleLowerCase();
    if (nameArr === name) {
      const countries = e.continent.countries;
      countries.forEach((country) => {
        makeSelectBtns(country, contSelect);
      });
    }
  });
  addSelectEvent(contSelect);
}

function makeSelectBtns(country, select) {
  const selectedSelect = document.querySelector(`.${select.id}Select`);
  const dropDownName = document.createElement("option");
  const cc = country.country_code;

  dropDownName.setAttribute("id", cc);
  dropDownName.innerText = country.name;
  selectedSelect.appendChild(dropDownName);
}

function addSelectEvent(name) {
  const selectedSelect = document.querySelector(`.${name.id}Select`);

  selectedSelect.addEventListener("change", (event) => {
    const optionName = event.target.value;
    const optionCc = event.target.options[event.target.selectedIndex].id;
    console.log(optionName);
    console.log(optionCc);
  });
}

function displayCountryInfo(optionName) {}

async function getCovidInfo() {
  const response = await axios.get(`${proxi}${covidInfo}`);
  return response.data;
}
async function addAndCompare(data) {
  data = data.data;
  // console.log(data);
  data.forEach((e) => {
    const newObj = {
      code: e.code,
      confrim: e.latest_data.confirmed,
      deadTotal: e.latest_data.deaths,
      critical: e.latest_data.critical,
      recovered: e.latest_data.recovered,
      deadNew: e.today.deaths,
      newCases: e.today.confirmed,
    };
    covidArr.push(newObj);
  });
}

getCovidInfo().then((data) => {
  addAndCompare(data);
});

// *will be triggered when continent button is pressed
let charLabels = [];
let charData = [];
function arrangeContinentCovidStat(idx) {
  setTimeout(() => {
    const contCompare = continentArr[idx].continent.countries;
    const fullCompare = covidArr;

    for (let i = 0; i < contCompare.length; i++) {
      for (let j = 0; j < fullCompare.length; j++) {
        if (contCompare[i].country_code === fullCompare[j].code) {
          console.log(contCompare[i].name, fullCompare[j].recovered);
          charLabels.push(contCompare[i].name);
          charData.push(fullCompare[j].recovered);
        }
      }
    }
  }, 500);
}

// ---------------------chart--------

const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    Labels: charLabels,
    datasets: [
      {
        label: "# of Votes",
        Data: charData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
