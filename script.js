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

//*starts the app by creating the country buttons
async function continentNames() {
  mainSec.innerHTML = "";
  for (let i = 0; i < names.length; i++) {
    makeButtons(names[i], i);
  }
}
continentNames();

//*creates buttons and adds event listeners that get covid statistics
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

//*remove individual country stats when continent btns are clicked again
function removeSpecific() {
  const specificDiv = document.querySelector(".specificCountryStats");
  if (typeof specificDiv !== "undefined" && specificDiv !== null) {
    specificDiv.parentNode.removeChild(specificDiv);
  } else {
  }
}

//* fetching country info
async function getCountryData(name) {
  const response = await axios.get(`${proxi}${countryInfo}${name}`);
  return response.data;
}

//*calls the country info API when continent is clicked and calls the dropDown functions (1sec delay)
function clickContinentBtn(name) {
  getCountryData(name).then((data) => {
    getCountNameNRegion(data);
  });

  setTimeout(() => {
    makeDropdown(name);
  }, 1000);
}

//*Populates specific continent arrays with relevant countries and their basic info
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

//*gathers objects from above and moves them to relevant array
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

//*creates the select menu under the right continent div
function makeDropdown(name) {
  const btnDiv = document.querySelector(`#${name}`);
  const select = document.createElement("select");
  select.classList.add(`${name}Select`);
  btnDiv.appendChild(select);

  populateOption(name);
}

//*goes over continant array and finds matches
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

//*creates the acutal options with links and country code information
function makeSelectBtns(country, select) {
  const selectedSelect = document.querySelector(`.${select.id}Select`);
  const dropDownName = document.createElement("option");
  const cc = country.country_code;

  dropDownName.setAttribute("id", cc);
  dropDownName.innerText = country.name;
  selectedSelect.appendChild(dropDownName);
}

//*adds the event listeners to all the options though the main 'select' - then creates all the logic needed to display the data if the option is clicked
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

//* populate the specific country div with the right info about said country - this is called in the option event above
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

//*gets all covid information for entire world - extracts the information needed in an object and stores it in a golbal array.
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

// *will be triggered when continent button is pressed - this compares the relevant continant array with the global covid array finds matches and pushes them to the chart
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
  }, 550);
}

//*arranges the chart and clears it before new changes
function updateChart(myChart, label, data, stat) {
  myChart.data.labels = label;
  myChart.data.datasets[0].data = data;
  myChart.data.datasets[0].label = stat;
  myChart.update();
}

//*creates the buttons for particualr statistics that display specific covid information. - triggered when a continent is checked initially
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

//* ---------------------chart--------

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
