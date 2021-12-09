const mainSec = document.querySelector(".main");

continentArr = [
  { continant: { name: "Asia", countries: [] } },
  { continant: { name: "Africa", countries: [] } },
  { continant: { name: "Europe", countries: [] } },
  { continant: { name: "Americas", countries: [] } },
  { continant: { name: "Oceania", countries: [] } },
];

function continantNames() {
  const names = ["asia", "africa", "europe", "americas", "oceania"];

  names.forEach((name) => {
    getCountryData(name);
  });
}

async function getCountryData(name) {
  const response = await axios.get(
    `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${name}`
  );
  console.log(response.data);
  getCountNameNRegion(response.data);
}

function getCountNameNRegion(data) {
  data.forEach((country) => {
    // console.log(country.name.common, country.region);
    let countName = country.name.common;
    let region = country.region;
    newObj = {
      name: countName,
      region: region,
    };
    pushCountries(newObj);
  });
}

function pushCountries(obj) {
  continentArr.forEach((el) => {
    // console.log(el.continant.name);
    if (obj.region === el.continant.name) {
      console.log("yes");
      el.continant.countries.push(obj);
    } else {
      //   console.log(el.continant.name, obj.name);
    }
  });
}
continantNames();
console.log(continentArr);
