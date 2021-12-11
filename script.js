const mainSec = document.querySelector(".main");
const ctx = document.getElementById("myChart").getContext("2d");
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

const names = ["Asia", "Africa", "Europe", "Americas", "Oceania"];

async function continentNames() {
  mainSec.innerHTML = "";
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
    statSpecificBtn(idx);
    removeSpecific();
  });
}

function removeSpecific() {
  const specificDiv = document.querySelector(".specificCountryStats");
  // console.log(specificDiv);
  if (typeof specificDiv !== "undefined" && specificDiv !== null) {
    // console.log("here", specificDiv);
    specificDiv.parentNode.removeChild(specificDiv);
  } else {
    // console.log("not here", specificDiv);
  }
}

async function getCountryData(name) {
  const response = await axios.get(`${proxi}${countryInfo}${name}`);
  // console.log(response.data);
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
      if (el.continent.countries.some((count) => count.name === obj.name)) {
        console.log("no double clicking!");
      } else {
        el.continent.countries.push(obj);
      }
    }
  }
}

function makeDropdown(name) {
  const btnDiv = document.querySelector(`#${name}`);
  const select = document.createElement("select");
  select.classList.add(`${name}Select`);
  btnDiv.appendChild(select);
  // console.log(btnDiv);

  populateOption(name);
}

function populateOption(name) {
  const contSelect = document.querySelector(`#${name}`);
  const contSelectSelect = document.querySelector(`.${name}Select`);
  contSelectSelect.innerHTML = "";

  continentArr.forEach((e) => {
    const nameArr = e.continent.name.toLocaleLowerCase();
    if (nameArr === name.toLowerCase()) {
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
    removeSpecific();
    const optionName = event.target.value;
    const optionCc = event.target.options[event.target.selectedIndex].id;

    covidArr.forEach((el) => {
      if (el.code === optionCc) {
        myChart.clear();
        const specificBtns = document.querySelector(".specific-stats");
        const Parent = document.querySelector(".specific-stats").parentNode;
        const specificDiv = document.createElement("div");
        specificDiv.classList.add("specificCountryStats");
        specificDiv.innerHTML = optionName;
        Parent.insertBefore(specificDiv, specificBtns);
        displayCountryInfo(optionCc, specificDiv);
      }
    });
  });
}

//* populate the specific country div with the right info about said country
function displayCountryInfo(optionCc, specificDiv) {
  covidArr.forEach((el) => {
    if (el.code === optionCc) {
      Object.entries(el).forEach(([key, value]) => {
        if (key !== "code") {
          const newItem = document.createElement("div");
          newItem.innerText = ` ${key} : ${value}`;
          newItem.classList.add("single-stat");
          specificDiv.appendChild(newItem);
        }
      });
    }
  });
}

async function getCovidInfo() {
  const response = await axios.get(`${proxi}${covidInfo}`);
  return response.data;
}
async function addAndCompare(data) {
  data = data.data;
  data.forEach((e) => {
    const newObj = {
      code: e.code,
      confrimed: e.latest_data.confirmed,
      [`total dead`]: e.latest_data.deaths,
      critical: e.latest_data.critical,
      recovered: e.latest_data.recovered,
      [`new dead`]: e.today.deaths,
      [`new cases`]: e.today.confirmed,
    };
    covidArr.push(newObj);
  });
}

getCovidInfo().then((data) => {
  addAndCompare(data);
});

// *will be triggered when continent button is pressed

function arrangeContinentCovidStat(idx, stat = [`total dead`]) {
  let charLabels = [];
  let charData = [];
  setTimeout(() => {
    const contCompare = continentArr[idx].continent.countries;
    const fullCompare = covidArr;
    charLabels = [];
    charData = [];

    for (let i = 0; i < contCompare.length; i++) {
      for (let j = 0; j < fullCompare.length; j++) {
        if (contCompare[i].country_code === fullCompare[j].code) {
          charLabels.push(contCompare[i].name);
          charData.push(fullCompare[j][stat]);
        }
      }
    }

    updateChart(myChart, charLabels, charData, stat);
  }, 500);
}

function updateChart(myChart, label, data, stat) {
  myChart.data.labels = label;
  myChart.data.datasets[0].data = data;
  myChart.data.datasets[0].label = stat;
  myChart.update();
}

function statSpecificBtn(idx) {
  const statsContainer = document.querySelector(".specific-stats");
  statsContainer.innerHTML = "";

  Object.keys(covidArr[0]).forEach(function (key) {
    if (key !== "code") {
      const statBtns = document.createElement("div");
      statBtns.classList.add("continentBtn");
      statBtns.innerText = `${key}`;
      statsContainer.appendChild(statBtns);
      statBtns.addEventListener("click", (e) => {
        removeSpecific();
        arrangeContinentCovidStat(idx, key);
      });
    }
  });
}

// ---------------------chart--------

const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",

        borderColor: "rgba(255, 99, 132, 1)",

        borderWidth: 1,
      },
    ],
  },
});
