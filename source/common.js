import { get, set } from 'lodash';

export const createElement = (type, id, className) => {
    const el = document.createElement(type);
    if (id) {
        el.setAttribute('id', id);
    }
    if (className) {
        el.setAttribute('class', className);
    }
    return el;
}

const storage = {};

export const setValue = (field, value) => {
    set(storage, field, value);
}

export const getValue = (field) => {
    return get(storage, field, null);
}