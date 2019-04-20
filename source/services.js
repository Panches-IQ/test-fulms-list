import axios from 'axios';

const baseURL = 'http://api.tvmaze.com/';

class services {
    getShowsList(str) {
        return axios.get(`${baseURL}search/shows?q=${str}`);
    }

    getShowCast(id) {
        return axios.get(`${baseURL}shows/${id}/cast`);
    }
}

export default new services();