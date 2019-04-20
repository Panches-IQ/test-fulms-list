import service from './services';
import { get, each } from 'lodash';
import { createElement, getValue, setValue } from './common';

const renderCast = () => {
    const casts = getValue('cast');
    const castName = getValue('cast_name');
    const container = getValue('casts_container');

    if (!castName) {
        container.innerHTML = '';
        return;
    }

    if ( !get(casts, 'length', 0) ) {
        container.innerHTML = `<h3>${castName}</h3><br><div> No casts for this movie </div>`;
        return;
    }

    container.innerHTML = '';
    const filmTitle = createElement('h3', null, 'film_title');
    filmTitle.innerHTML = getValue('cast_name');
    container.appendChild(filmTitle);

    each(casts, item => {
        const el = createElement('div', null, 'person_wrapper');
        const img = get(item, 'person.image.medium', null) ? `<img src=${item.person.image.medium}></img>` : '';
        const gender = get(item, 'person.gender', null) ? `<div class='person_gender'>${'Gender: '+item.person.gender}</div>` : '';
        const birthday = get(item, 'person.birthday', null) ? `<div class='person_birthday'>${'Birth: '+item.person.birthday}</div>` : '';
        el.innerHTML = `
            <div class='person_name'>${'Name: '+get(item, 'person.name', '***')}</div>
            ${img}
            ${gender}
            ${birthday}
        `;
        container.appendChild(el);
    });
}

const showCast = (id, name) => () => {
    setValue('cast_name', name);
    service.getShowCast(id)
        .then((res) => {
            const cast = get(res, 'data', []).sort((a,b) => {
                const dateA = get(a, 'person.birthday', null);
                const dateB = get(b, 'person.birthday', null);
                return dateA > dateB ? 1 : -1; // compare strings
            });
            setValue('cast', cast);
            renderCast();
        })
        .catch(console.log);
}

const renderFilms = () => {
    const data = getValue('data');
    const container = getValue('films_container');

    if ( !get(data, 'length', 0) ) {
        container.innerHTML = `<div> No search data found </div>`;
        return;
    }

    container.innerHTML = '';

    each(data, item => {
        const el = createElement('div', null, 'film_wrapper');
        const id = get(item, 'show.id', null);
        const name = get(item, 'show.name', '***unknown***');
        if (!id) {
            return;
        }
        el.onclick = showCast(id, name);
        el.innerHTML = name;
        container.appendChild(el);
    });
}

const runSearch = () => {
    const input = getValue('search_input');
    const value = get(input, 'value', '');
    service.getShowsList(value)
        .then((res) => {
            setValue('data', res.data);
            renderFilms();
        })
        .catch(console.log);
}

const resetSearch = () => {
    const input = getValue('search_input');
    input.value = '';
    setValue('data', []);
    setValue('cast_name', null);
    renderFilms();
    renderCast();
}

const runApp = () => {
    const search = getValue('search_button');
    search.onclick = runSearch;
    const reset = getValue('reset_button');
    reset.onclick = resetSearch;
}

const initContainer = () => {
    const mainContainerEl = document.getElementById('films_app_container');
    const inputElem = document.getElementById('input_search');
    const filmsContainerEl = document.getElementById('films_container');
    const searchButtonEl = document.getElementById('search_button');
    const castContainerEl = document.getElementById('casts_container');
    const resetButtonEl = document.getElementById('reset_button');

    if (!mainContainerEl || !inputElem || !filmsContainerEl || !searchButtonEl || !castContainerEl) {
        return alert('Unable to run application');
    }

    setValue('main_container', mainContainerEl);
    setValue('search_input', inputElem);
    setValue('films_container', filmsContainerEl);
    setValue('search_button', search_button);
    setValue('casts_container', castContainerEl);
    setValue('reset_button', resetButtonEl);

    runApp();
}

window.onload = initContainer;