
let leftSideData;
let rightSideData;

const onCountrySelect = async (country, target, side) => {
  const response = await axios.get("https://api.covid19api.com/total/country/" + country.Slug);
  console.log(country.ISO2);
  const countryCode = country.ISO2.toLowerCase();
  const population = (worldPopulation[countryCode]);


  if(side ==="left"){
    leftSideData = response.data;
  }else{
    rightSideData = response.data;
  };
  
  target.innerHTML = summaryTemplate(country, response.data, population);
  
  
  if(leftSideData && rightSideData){
    runComparison();
  }
}



const runComparison = () => {
  const leftSideStats = document.querySelectorAll("#left-summary .notification");
  const rightSideStats = document.querySelectorAll("#right-summary .notification");
  
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);

    if(rightSideValue < leftSideValue){
      leftStat.classList.remove("is-success");
      leftStat.classList.add("is-danger");
      rightStat.classList.remove("is-danger");
      rightStat.classList.add("is-success");
    }else{
      rightStat.classList.remove("is-success");
      rightStat.classList.add("is-danger");
      leftStat.classList.remove("is-danger");
      leftStat.classList.add("is-success");
    }


  })
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}


const summaryTemplate = (country,details,population) => {


  let latestStats = details[details.length - 1];
  const pop = parseFloat(population.Population.replace(/,/g, ''));
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="https://www.countryflags.io/${country.ISO2}/shiny/32.png" style="height: 32px; width: 32px;">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${country.Country}</h1>
          <h4>Population: ${numberWithCommas(pop * 1000)}</h4>
        </div>
      </div>
    </article>
    <article data-value="${latestStats.Confirmed}" class="notification is-primary">
      <p class="title">${numberWithCommas(latestStats.Confirmed)}</p>
      <p class="subtitle">Confirmed</p>
    </article>
    <article data-value="${~~(latestStats.Confirmed / (pop / 1000))}" class="notification is-primary">
    <p class="title">${numberWithCommas(~~(latestStats.Confirmed / (pop / 1000)))}</p>
    <p class="subtitle">Confirmed / 1M POP</p>
  </article>
  <article data-value="${latestStats.Deaths}" class="notification is-primary">
    <p class="title">${numberWithCommas(latestStats.Deaths)}</p>
    <p class="subtitle">Deaths</p>
  </article>  
  <article data-value="${~~(latestStats.Deaths / ( pop / 1000))}" class="notification is-primary">
      <p class="title">${numberWithCommas(~~(latestStats.Deaths / ( pop / 1000)))}</p>
      <p class="subtitle">Deaths / 1M POP</p>
    </article>
    <article data-value="${latestStats.Recovered}" class="notification is-primary">
      <p class="title">${numberWithCommas(latestStats.Recovered)}</p>
      <p class="subtitle">Recovered</p>
    </article>
    <article data-value="${~~(latestStats.Recovered / ( pop / 1000))}" class="notification is-primary">
      <p class="title">${numberWithCommas(~~(latestStats.Recovered / ( pop / 1000)))}</p>
      <p class="subtitle">Recovered / 1M POP</p>
    </article>
    <article data-value="${latestStats.Active}" class="notification is-primary">
      <p class="title">${numberWithCommas(latestStats.Active)}</p>
      <p class="subtitle">Active</p>
    </article>
    <article data-value="${~~(latestStats.Active / ( pop / 1000))}" class="notification is-primary">
      <p class="title">${numberWithCommas(~~(latestStats.Active / ( pop / 1000)))}</p>
      <p class="subtitle">Active / 1M POP</p>
    </article>

  `
};

//AutoComplete Config
const autoCompleteConfig = {
  renderOption(option){
  return `
  <img src="https://www.countryflags.io/${option.ISO2}/shiny/64.png" style="height: 32px; width: 32px;"> ${option.Country}
  `;
  },
  inputValue(value){
    return value;
  },
  async fetchData(searchTerm){
    const response = await axios.get('https://api.covid19api.com/countries');
    return response.data;
  }};



//Left Autocomplete
autoComplete({
  root: document.querySelector("#left-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect(option){
    onCountrySelect(option, document.querySelector("#left-summary"), "left");
    document.querySelector(".tutorial").classList.add("is-hidden");
  }
}); 

//Right AutoComplete
autoComplete({
  root: document.querySelector("#right-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect(option){
    onCountrySelect(option, document.querySelector("#right-summary"), "right");
    document.querySelector(".tutorial").classList.add("is-hidden");
  },
}); 




