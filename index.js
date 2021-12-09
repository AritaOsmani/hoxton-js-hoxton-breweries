const main = document.querySelector('main');
const articleEl = document.createElement('article');
const asideEL = document.createElement('aside');
asideEL.setAttribute('class', 'filters-section');
const filterTypeSelect = document.createElement('select');
const state = {
    // breweries: [],
    breweriesByState: [],
    breweriesCities: [],
    breweryTypes: ['micro', 'regional', 'brewpub'],
    selectedBreweryType: '',
    selectedCities: [],
    breweryName: ''
}


function getStateFromForm() {
    const stateForm = document.querySelector('#select-state-form');
    const stateInput = document.querySelector('#select-state');
    stateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const stateGiven = stateInput.value;
        getBreweriesByState(stateGiven).then(obj => {
            state.breweriesByState = obj;
            state.selectedCities = [];
            state.breweryName = '';
            render();
        });
    })
}
function getBreweriesToDisplay() {
    let breweriesToDisplay = state.breweriesByState;
    if (state.selectedBreweryType !== '') {
        breweriesToDisplay = breweriesToDisplay
            .filter(brewery => brewery['brewery_type'] === state.selectedBreweryType)
    } else if (state.selectedCities.length !== 0) {

        for (const item of state.selectedCities) {
            breweriesToDisplay = breweriesToDisplay.filter(brewery => brewery.city === item)
        }
    } else if (state.breweryName !== '') {
        breweriesToDisplay = breweriesToDisplay.filter(brewery => brewery.name === state.breweryName)
    }
    breweriesToDisplay = breweriesToDisplay.filter(function (brewery) {
        return state.breweryTypes.includes(brewery['brewery_type']);
    })

    breweriesToDisplay = breweriesToDisplay.slice(0, 10);
    return breweriesToDisplay;
}
function listenToSelectElement() {
    filterTypeSelect.addEventListener('change', function () {
        state.selectedBreweryType = filterTypeSelect.value;
        render();
        state.selectedBreweryType = ''
    })
}
function getSelectedCheckbox() {
    const cityCheckboxes = document.querySelectorAll('.city-checkbox');
    state.selectedCities = [...cityCheckboxes].filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

}

function renderHeaderElements() {
    const title = document.createElement('h1');
    title.textContent = 'List of Breweries'
    const headerEl = document.createElement('header');
    headerEl.setAttribute('class', 'search-bar');

    if (state.breweriesByState.length === 0) {
        title.style.display = 'none';
        headerEl.style.display = 'none';
    } else {
        title.style.display = 'block';
        headerEl.style.display = 'block';
    }

    const formEl = document.createElement('form');
    formEl.setAttribute('id', 'search-breweries-form');
    formEl.setAttribute('autocomplete', 'off');


    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', 'search-breweries');

    const searchTitle = document.createElement('h2');
    searchTitle.textContent = 'Search breweries:';

    //Add search title to label:
    labelEl.append(searchTitle);

    const inputEl = document.createElement('input');
    inputEl.setAttribute('id', 'search-breweries');
    inputEl.setAttribute('name', 'search-breweries');
    inputEl.setAttribute('type', 'text');

    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        const cityName = inputEl.value;
        state.breweryName = cityName;
        render();
    })

    //Add labelEl and inputEl to the formEl:
    formEl.append(labelEl, inputEl);

    //Add  formEl to headerEl:
    headerEl.append(formEl);
    main.append(title, headerEl);
}

function createListElements() {
    const listContainer = document.createElement('ul');
    listContainer.setAttribute('class', 'breweries-list');
    const breweriesToDisplay = getBreweriesToDisplay();
    for (const brewery of breweriesToDisplay) {
        const listElement = createBreweryProperties(brewery)
        //Add listElement to listContainer:
        listContainer.append(listElement);
    }
    //Add listContainer to articleEl:
    articleEl.append(listContainer);

    //Add title, header and article to main:

    main.append(articleEl);

}

function createBreweryProperties(brewery) {
    //List items
    const listElement = document.createElement('li');

    const breweryTitle = document.createElement('h2');
    breweryTitle.textContent = brewery.name;

    const breweryType = document.createElement('div');
    breweryType.setAttribute('class', 'type');
    breweryType.textContent = brewery['brewery_type'];

    const addressSection = document.createElement('section');
    addressSection.setAttribute('class', 'address');

    const addressTitle = document.createElement('h3');
    addressTitle.textContent = 'Address:';
    const firstPartAdd = document.createElement('p');
    firstPartAdd.textContent = brewery['address_2'];
    const secPartAdd = document.createElement('strong');
    secPartAdd.textContent = brewery.street;
    const secPartAddContainer = document.createElement('p');

    //Add secPartAdd to secPartAddContaoner:
    secPartAddContainer.append(secPartAdd);
    //Add addressTitle, firtPartAdd, secPartAddContainer to addressSection
    addressSection.append(addressTitle, firstPartAdd, secPartAddContainer);

    const phoneSection = document.createElement('section');
    phoneSection.setAttribute('class', 'phone');
    const phoneTitle = document.createElement('h3');
    phoneTitle.textContent = 'Phone:';
    const phoneNumber = document.createElement('p');
    phoneNumber.textContent = brewery.phone;

    //Add phoneTitle and phoneNumber to phoneSection:
    phoneSection.append(phoneTitle, phoneNumber);

    const linkSection = document.createElement('section');
    linkSection.setAttribute('class', 'link');

    const link = document.createElement('a');
    link.setAttribute('href', brewery['website_url']);
    link.setAttribute('target', 'blank');
    link.textContent = 'Visit Website';

    //Add link to linkSection:
    linkSection.append(link);

    //Add sections to listElement:
    listElement.append(breweryTitle, breweryType, addressSection, phoneSection, linkSection);
    return listElement;

}
function renderFilterSection() {
    asideEL.innerHTML = ''
    filterTypeSelect.innerHTML = ''
    if (state.breweriesByState.length === 0) {
        asideEL.style.display = 'none';
    } else {
        asideEL.style.display = 'block';
    }
    const filterByTitle = document.createElement('h2');
    filterByTitle.textContent = 'Filter By:';

    const filterTypeForm = document.createElement('form');
    filterTypeForm.setAttribute('id', 'filter-by-type-form');
    filterTypeForm.setAttribute('autocomplete', 'off');

    const filterTypeLabel = document.createElement('label');
    filterTypeLabel.setAttribute('for', 'filter-by-type');

    const typeOfBreweryTitle = document.createElement('h3');
    typeOfBreweryTitle.textContent = 'Type of Brewery';

    //Add typeOfBreweryTitle to filterTypeLabel:
    filterTypeLabel.append(typeOfBreweryTitle);


    filterTypeSelect.setAttribute('id', 'filter-by-type');
    filterTypeSelect.setAttribute('name', '"filter-by-type');
    const initialOption = document.createElement('option');
    initialOption.setAttribute('value', null);
    initialOption.textContent = 'Select a type...';
    filterTypeSelect.append(initialOption);

    for (const type of state.breweryTypes) {
        const optionEl = document.createElement('option');
        optionEl.setAttribute('value', type);
        optionEl.textContent = type;
        filterTypeSelect.append(optionEl);
    }

    //Add filterTypeSelect to filterTypeForm:
    filterTypeForm.append(filterTypeSelect);

    const filterByCityDiv = document.createElement('div');
    filterByCityDiv.setAttribute('class', 'filter-by-city-heading');

    const citiesTitle = document.createElement('h3');
    citiesTitle.textContent = 'Cities';

    const clearBtn = document.createElement('button');
    clearBtn.setAttribute('class', 'clear-all-btn');
    clearBtn.textContent = 'clear all';

    //Add citiesTitle and clearBtn to filterByCityDiv:
    filterByCityDiv.append(citiesTitle, clearBtn);

    const filterCityForm = document.createElement('form');
    filterCityForm.setAttribute('id', 'filter-by-city-form');


    getCities();
    for (const city of state.breweriesCities) {
        const checkboxEl = document.createElement('input');
        checkboxEl.setAttribute('id', city)
        checkboxEl.setAttribute('type', 'checkbox');
        checkboxEl.setAttribute('name', city);
        checkboxEl.setAttribute('class', 'city-checkbox');
        checkboxEl.setAttribute('value', city);
        const checkboxLabel = document.createElement('label');
        checkboxLabel.setAttribute('for', city);
        checkboxLabel.textContent = city;

        checkboxEl.addEventListener('click', function () {

            getSelectedCheckbox();
            render();
        })
        //Add checkbox to form:
        filterCityForm.append(checkboxEl, checkboxLabel);
    }


    //Add everything to asideEl:
    asideEL.append(filterByTitle, filterTypeForm, filterByCityDiv, filterCityForm);
    main.append(asideEL);

}
function getBreweriesFromDatabase() {
    return fetch('https://api.openbrewerydb.org/breweries').then(res => res.json())
}

function getBreweriesByState(state) {
    return fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}&per_page=50`).then(res => res.json())
}



function getBreweriesByCity(city) {
    return fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`).then(res => res.json());
}

function getBreweriesByType(type) {
    return fetch(`https://api.openbrewerydb.org/breweries?by_type=${type}`).then(res => res.json())
}

function getCities() {
    let newArr = []
    for (const brewery of state.breweriesByState) {
        newArr.push(brewery.city);
    }
    //From Stack Overflow: Removes repeated elements
    newArr = newArr.filter(function (item, pos) {
        return newArr.indexOf(item) == pos;
    })
    state.breweriesCities = newArr;

}
function render() {
    renderHeaderElements();

    articleEl.innerHTML = ''

    createListElements();
    renderFilterSection()
}

function init() {
    // getBreweriesFromDatabase().then(function (breweriesFromDatabase) {
    //     state.breweries = breweriesFromDatabase;
    //     getCities()
    // })
    getStateFromForm();
    render();
    listenToSelectElement();

}



init();
