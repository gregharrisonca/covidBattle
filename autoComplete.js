const autoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {
    let sorted;
    root.innerHTML = `
    <label><b>Choose a Country</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
    `;

    const input = root.querySelector("input");
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = async event => {
        items = await fetchData(event.target.value);
        resultsWrapper.innerHTML = "";
        dropdown.classList.add("is-active");
        sortData(items, event.target.value);
        if(!sorted.length){
          dropdown.classList.remove("is-active");
          return;
        }
        for(let sort of sorted){
            option = document.createElement('a');
            option.classList.add("dropdown-item");
            option.innerHTML = renderOption(sort);
            
            option.addEventListener('click', ()=>{
              dropdown.classList.remove('is-active');
              input.value = inputValue(sort.Country);
              onOptionSelect(sort);
            });
    
            resultsWrapper.appendChild(option);
        }
    };
    input.addEventListener('input', debounce(onInput, 250));

    document.addEventListener("click", event => {
        if(!root.contains(event.target)){
            dropdown.classList.remove("is-active");
        }
    })

    const sortData = (itemsToSort, sortTerm) => {
        sorted = itemsToSort.filter(function(obj) {
          return Object.keys(obj).some(function(key) {
            return obj[key].includes(sortTerm);
          })
        });
      };
}

