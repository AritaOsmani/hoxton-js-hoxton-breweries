const main = document.querySelector('main');

const state = {
    breweries: [],
    breweriesByState: [],
    breweriesCities: [],
    // availableStates:[],
}

function getStateFromForm() {
    const stateForm = document.querySelector('#select-state-form');
    const stateInput = document.querySelector('#select-state');
    stateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const stateGiven = stateInput.value;
        getBreweriesByState(stateGiven).then(obj => {
            state.breweriesByState = obj;
            state.breweriesByState = state.breweriesByState.filter(element => {
                return element['brewery_type'] === 'micro' || element['brewery_type'] === 'regional' || element['brewery_type'] === 'brewpub'
            })
            let newArray = [];
            for (let i = 0; i < 10; i++) {
                newArray.push(state.breweriesByState[i]);
            }
            // state.breweriesByState = newArray;
            render();
            createListElements(newArray);

        });
        // stateInput.value = '';

    })

}
function renderHeaderElements() {
    const title = document.createElement('h1');
    title.textContent = 'List of Breweries'
    const headerEl = document.createElement('header');
    headerEl.setAttribute('class', 'search-bar');

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

    //Add labelEl and inputEl to the formEl:
    formEl.append(labelEl, inputEl);

    //Add  formEl to headerEl:
    headerEl.append(formEl);
    main.append(title, headerEl);
}
const articleEl = document.createElement('article');

function createListElements(array) {


    const listContainer = document.createElement('ul');

    listContainer.setAttribute('class', 'breweries-list');
    console.log('before loop')

    for (const brewery of array) {
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

function getBreweriesFromDatabase() {
    return fetch('https://api.openbrewerydb.org/breweries').then(res => res.json())
}

// function getBreweriesByState(state) {
//     return fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}&per_page=10`).then(res => res.json())
// }

function getBreweriesByState(state) {
    return fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}`).then(res => res.json())
}



function getBreweriesByCity(city) {
    return fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`).then(res => res.json());
}

function getBreweriesByType(type) {
    return fetch(`https://api.openbrewerydb.org/breweries?by_type=${type}`).then(res => res.json())
}

function getCities() {
    let newArr = []
    for (const brewery of state.breweries) {
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
}

function init() {
    getBreweriesFromDatabase().then(function (breweriesFromDatabase) {
        state.breweries = breweriesFromDatabase;
        getCities()
    })



    getStateFromForm();
    render();
}



init();
