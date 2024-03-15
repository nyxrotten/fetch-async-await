const containerPpal = document.getElementById('app');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');

const urlBasica = 'https://pokeapi.co/api/v2/pokemon';
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const limit = 10;
let offset = 0;
let maxCount = 0;

function getAPokeApi(url) {
    return new Promise((resolve) => {
        fetch(url)
            .then((res) => {
                if(!res.ok){
                    throw new Error ('Lo sentimos, Pokemon no encontrado!');    
                }else{
                    return res.json();
                }
            })
            .then(data => {
                resolve(data);
            })
            .catch((error) => {
                showError(error);
            });
    });
}



function cargaInicial() {
    let urlapi = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    DamePokemons(urlapi);
}
cargaInicial();

searchBtn.addEventListener('click', () => {
    let pokeABuscar = searchInput.value;
    let urlApi = urlBasica;
    console.log(pokeABuscar);
    if(pokeABuscar !== ''){
        urlApi += `/${pokeABuscar}`;
        DameMiPokemon(urlApi);
    }
    else {
        containerPpal.innerHTML = '';
        showError('Debes introducir un nombre de pokemon!');
    }
    
}); 


prevBtn.addEventListener('click', () => {
    offset = (offset >= limit) ? offset - limit : offset;
    let urlApi = `${urlBasica}?limit=${limit}&offset=${offset}`;
    DamePokemons(urlApi);
}); 


nextBtn.addEventListener('click', () => {
    offset = (offset < maxCount) ? offset + limit : maxCount;
    let urlApi = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    DamePokemons(urlApi);
}); 

resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    cargaInicial();
});

function DameMiPokemon (url) {
    const getPokemonsApi = getAPokeApi(url);
    getPokemonsApi.then((poke) => {
        
        containerPpal.innerHTML = '';
        const ulElem = document.createElement('ul');
        pintaPokemon(ulElem, poke);
        containerPpal.appendChild(ulElem);

    }).catch((error) => {
        showError(error);
    });
}


function DamePokemons(url) {
    const getPokemonsApi = getAPokeApi(url);
    //console.log('getPokemonsApi: '+ getPokemonsApi);
    getPokemonsApi.then((data) => {

        let arrApiPokes = [];
        
        maxCount = data.count;
        //console.log(maxCount);
        data.results.forEach(poke => {
            arrApiPokes.push(poke.url);
        });
        return arrApiPokes;

    }).then((arrApiPokes) => {
    
        
        let misPromesasPokes = [];
        arrApiPokes.forEach(poke => {
            misPromesasPokes.push(getAPokeApi(poke));
        });
        return misPromesasPokes;
        
    }).then((misPromesas) => {

        Promise.all(misPromesas)
        .then((arrayPokemon) => {
            //console.log('arrayPokemon: ', arrayPokemon.map(item => item.name));
            showPokemons(arrayPokemon);
        })
        .catch((error) => {
            showError(error);
        });
        console.log('fin');

    }).catch((error) => {
        showError(error);
    });
}

function showPokemons(arrayPokemon) {
    containerPpal.innerHTML = '';
    const ulElem = document.createElement('ul');
    arrayPokemon.forEach(poke => {
        //console.log(' en bucle ' + poke.name);
        pintaPokemon(ulElem, poke);
    });

    containerPpal.appendChild(ulElem);
}

function pintaPokemon(ulElem, miPoke) {
    const liElem = document.createElement('li');
    liElem.id = 'cajaPoke';
    const name = document.createElement('p');
    const imagen = document.createElement('img');
    name.innerHTML = miPoke.name;
    imagen.src = miPoke.sprites.other.dream_world.front_default;
    imagen.alt = miPoke.name;
    liElem.appendChild(imagen);
    liElem.appendChild(name);
    ulElem.appendChild(liElem);
}

function showError(txt) {
    containerPpal.innerHTML = '';
    let div = document.createElement('div');
    div.innerHTML = txt;
    containerPpal.appendChild(div);
}