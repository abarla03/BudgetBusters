import axios from "axios";

export function post(url, body) {
    return axios.post(url, body);
}

export function get(url, params) {
    return axios.get(url, params);
}

export function put(url, body) {
    return axios.put(url, body);
}